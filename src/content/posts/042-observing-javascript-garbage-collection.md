---
title: "Potential Use For WeakRef: Manually Plugging Memory Leaks"
on-page-title-prefix: 🗑️🔎
published: 2024-02-22T03:35:00+06:00
edited: 2024-02-22T03:35:00+06:00
tags:
    - javascript
    - internal
---

# TL;DR

[WeakRef](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakRef) (sometimes) helps
you manually plug memory leaks when it's not apparent to the garbage collector that it isn't worth keeping an
object around, but it only works if you're extremely careful.

# Introduction

We use postMessage to communicate between browser contexts a lot, thus I am in the process of 
developing [typed-postmessage-rpc](https://github.com/open-fringecore/typed-postmessage-rpc), the type-safe rpc
framework for communication between browser contexts inspired by [trpc](https://trpc.io/). As such, I'm also adding [subscription](https://trpc.io/docs/v10/subscriptions) support besides the usual remote  procedure invocation.

Problems:

1. When working with [MessageChannels](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel), there is no event I could hook into to know if the other [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort) of the pair is closed.
2. It's worse because a [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort/postMessage) call doesn't throw an exception either. 
3. When the iframe navigates away or when the worker is shutdown, the observable and its emitter will still live on. (memory leak, wasted CPU)

# Setup The Problem

```ts
// pretend this code runs inside an iframe.
function runIframe(port: MessagePort) {
    port.onmessage = (ev: MessageEvent) => {
        console.log('data:', ev.data);
    }

    port.postMessage('send-me-random-numbers-pls');

    // close the port after 2s
    setTimeout(() => port.close(), 2000);
}

// pretend this code runs on the parent window.
function runParentWindow(port: MessagePort) {
    function parentMessageHandler(ev: MessageEvent) {
        if (ev.data === 'send-me-random-numbers-pls') {
            setInterval(() => {
                console.log('sending number');
                port.postMessage(Math.random());
            }, 500);
        }
    }

    port.onmessage = parentMessageHandler;
}

function start() {
  const channel = new MessageChannel();

  runParentWindow(channel.port1);
  runIframe(channel.port2);
}

start();
```

Clearly the code inside the `setInterval` should stop after 2 seconds, at least via an exception right? Wrong. 
You'll notice once you run it, the lines with `sending number` keep coming and coming, but `data: ...` on the
other hand does not, because the port is closed of course.

If only there was a way to check if the port is still open right before we send a new message.

# Potential Solution

`WeakRef` to Check if The `port` is Has Been Garbage Collected

```ts ins={3,9,13-17,22}
function runParentWindow(port: MessagePort) {
    // store a WeakRef to the port itself.
    const portRef = new WeakRef(port);

    function parentMessageHandler(ev: MessageEvent) {
        if (ev.data === 'send-me-random-numbers-pls') {
            const interval = setInterval(() => {
                // use the MessagePort returned after `.deref()`
                const dereferencedPort = portRef.deref();

                // cleanup interval if the port is not available
                // after dereferencing.
                if (!dereferencedPort) {
                  console.log('stopped');
                  clearInterval(interval);
                  return;
                }

                console.log('sending number');

                // using `port` directly will prevent GC.
                dereferencedPort.postMessage(Math.random());
            }, 500);
        }
    }

    port.onmessage = parentMessageHandler;
}
```

Fun fact: The browser actually already knows the other port is closed hence the local reference can be cleaned
up, which is why the browser only runs GC when `port2` is closed. It just doesn't allow us to hook into it.

If you comment out the `setTimeout` that closes the port, you'll notice even in the code that is using WeakRef,
the browser does not grabage collect the `port1`.

# Prove It

Let's Trigger GC to Double Check.

There is honestly no way of knowing when GC will run, hence we should know how to trigger GC manually.
Thanks to Chrome's DevTools we can. Suffice to say, Chrome is a prerequisite.

![Run GC Instructions](https://object-storage.omranjamal.me/run-gc.png)

1. Open Chrome DevTools
2. Go to the `Performance` tab
3. Click the trash icon.

# Bad Solution? Yes.

This is a horrible solution.

1. There is no garuntee the runtime (in this case v8) will run GC.
2. There is no way to programatically trigger GC.
3. Just one reference (that isn't weak) somewhere else in the code, and the entire approach falls apart.
4. Accidentally storing a reference to the de-referenced port will also prvent garbage collection.

## Better Solution

The better solution has nothing to do with WeakRef, but in case you want to know my curious reader,
it would be the following ...

1. Creating a system of acknowledgements for when emitted data is received on the client side.
2. Making sure emitted messages are numbered, and acknowledgements are also numbered.
3. Checking to see if the last emitted message number and the last received acknowledge number matches.
4. if the numbers don't match: Checking to see if the time between now and the last 
   sent message is under a certain threshold.
5. Cleanup if the time difference is above the threshold.

Know a better solution? Open a PR, or even an Issue on 
[typed-postmessage-rpc](https://github.com/open-fringecore/typed-postmessage-rpc); alternatively
email me at [omran@omranjamal.me](mailto:omran@omranjamal.me)
