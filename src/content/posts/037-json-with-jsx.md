---
pageTitle: JSX is Just a Tree Builder
title: JSX is Just a Tree Builder — Let's Make JSON
on-page-title-prefix: 🤡
short-description: JSON is just a tree. JSX is a tree builder. Hmm.
published: 2024-06-22 02:00:00+6
edited: 2024-06-22 02:00:00+6
highlight: true
tags:
  - json
  - jsx
  - tree
  - insanity
---

# What?

Here's the big secret, JSX isn't special and although React had a lot to do with the invention of
JSX, JSX isn't exclusive to React. JSX can be used to build any kind of tree in memory. In fact
you can customize exactly what will be returned from a JSX expression.

# TL;DR

You can read the entire source code on [Github](https://github.com/omranjamal/jsx-json). Or you could actually use it in a project by installing [`jsx-json` from NPM](https://www.npmjs.com/package/jsx-json).

# First: JSX to JS

So we kinda know that in order to use JSX we must use Babel or TypeScript, so it follows that
JSX compiles down to raw JS. So what does it compile down to?

Here's an example ...

```jsx
function Test() {
  return (
    <div className="font-bold">
      <span>tomato</span>
    </div>
  );
}
```

The above JSX code turns into the following ...

```js
function Test() {
    return React.createElement(
      "div",
      { className: "font-bold" },
      React.createElement("span", null, "tomato")
    );
}
```

The thing is, JSX doesn't even have to HTML. You see how `div` just turns into a string? That string is actually arbitrary.

You can test it yourself on the [TypeScript Playground](https://www.typescriptlang.org/play/).

## What Happens to Multiple Children?

Nothing they just get passed as more arguments at the end of the call.

```tsx
<div>
  <span>tomato</span>
  <span>potato</span>
</div>
```

Becomes ...

```tsx ins={5}
React.createElement(
  "div", 
  null,
  React.createElement("span", null, "tomato"),
  React.createElement("span", null, "potato")
);
```

# Customizing The "JSX Factory"

"JSX factory" is just a fancy term for a function that each JSX statement gets converted into when transpiling to JS. The `React.createElement` function would be the factory for the above code snippet. We want to turn that into `jsxjson`, a function that we will soon write.

Thankfully, TypeScript always has our back. Simply adding the comment such as below to the top of any `.tsx` file will instruct the TypeScript compiler to use `jsxjson` instead _(but only for that particular file)_.

```tsx
/* @jsx jsxjson */
<div>tomato</div>
```

Becomes ...

```js
jsxjson("div", null, "tomato");
```

Just for completeness the above comment is formally known as a [Compiler Directive](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/preprocessor-directives).

# Let's Make JSON With JSX

This is of course so that we can learn to harness the power of JSX better. It actually _does_ have _some_ benefits which we will get to soon later in the article.

## Visualizing The End Result

We want the values of the two identifiers below to be deeply equal.

```jsx
const jsx = (
  <object>
    <name>Omran Jamal</name>
    <height>{173}</height>
    <hobbies>
      <array>
        <item>rebelling against the machine</item>
        <item>parks</item>
      </array>
    </hobbies>
  </object>
);

const json = {
  name: "Omran Jamal",
  age: 27,
  hobbies: ["rebelling against the machine", "parks"],
};

assert.deepEqual(jsx, json);
```

## Writing The `jsxjson` Function

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
  // props can be any dictionary with string keys,
  // and values of any type.

  // children is variadic so that we can handle an arbitrary number of
  // passed children
}
```

## Handling Objects & Properties

If we focus on just objects and their properties, we'll have a smaller problem to solve.


```jsx
/* @jsx jsxjson */

const data = (
    <object>
        <name>Omran Jamal</name>
        <height>{173}</name>
    </object>
)
```

Becomes ...

```js
const data = (jsxjson("object", null,
    jsxjson("name", null, "Omran Jamal"),
    jsxjson("height", null, 173)));
```

### Properties

For now, let's return an object with just one property and one value, this will be useful later when we implement objects.

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
    return {
        [tagName]: children[0]
    };
}

<name>Omran Jamal</name> // { name: "Omran Jamal" }
```

### Object

It's time for a ternary and a reducer.

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
    return tagName === 'object'
        ? children.reduce((acc, cur) => ({
            ...acc,
            ...cur
        }), {})
        : {[tagName]: children[0]};
}

console.log(
    <object>
        <name>Omran Jamal</name>
    </object>
) // { name: "Omran Jamal" }

console.log(
    <object>
        <name>Omran Jamal</name>
        <height>{173}</height>
    </object>
) // { name: "Omran Jamal", height: 173 }
```

Isn't it magical?

Could we have used an if condition and a loop? Yes. But, this way I get to pretend that I'm a functional programming pro.

### Properties Named "object"

What if we want to add a property named `object` or a property name that starts with a number or `_`?

Let's introduce a `<prop/>` tag.

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
    return tagName === 'object'
        ? children.reduce((acc, cur) => ({
            ...acc,
            ...cur
        }), {})
        : tagName === 'prop'
        ? { [props.key]: children[0] }
        : { [tagName]: children[0] };
}

console.log(
    <object>
        <prop key="object">objectification</name>
    </object>
) // { object: "objectification" }
```

The prop tag takes a prop itself called `key`, this allows arbitraty keys to be accessed inside `props.key`

## Arrays & Items

### Items

For items, we'll just return the first child with no wrapping. This will once again be useful in the next section when we take all the items and put it into one array.

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
    return tagName === 'object'
        ? children.reduce((acc, cur) => ({
            ...acc,
            ...cur
        }), {})
        : tagName === 'prop'
        ? { [props.key]: children[0] }
        : tagNaame === 'item'
        ? children[0]
        : { [tagName]: children[0] };
}

console.log(
    <item>tomato</item>
) // "tomato"
```

### Arrays

We'll just collect all the items and return it. This is a fancy way of say we'll just return the entire children array.

```tsx
/* @jsx jsxjson */

function jsxjson(tagName: string, props: Record<string, any> | null, ...children: any[]) {
    return tagName === 'object'
        ? children.reduce((acc, cur) => ({
            ...acc,
            ...cur
        }), {})
        : tagName === 'prop'
        ? { [props.key]: children[0] }
        : tagName === 'item'
        ? children[0]
        : tagName === 'array'
        ? children
        : { [tagName]: children[0] };
}

console.log(
    <array>
        <item>mango</item>
        <item>tomato</item>
    </array>
) // ["mango", "tomato"]
```

# TypeScript Errors

You'll notice TypeScript constantly showing an error on each tag like.

```
JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.
```

Asking typescript to chill sometimes is not ideal but a necessary evil. Adding the following snippet to the top will let TypeScript know that `object`, `prop`, `array`, and `item` are valid tags. As is all the other tags. It will also let TypeScript that know that `prop` takes a prop called `key` giving you that sweet sweet code completion hints.

```tsx
declare namespace JSX {
    interface IntrinsicElements {
        object: {},
        prop: {
            key: string;
        },
        array: {},
        item: {},
        [key: string]: {};
    }
}
```

You could also enable it project wide by pasting it into a file called `jsxjson.d.ts` and placing it in the root of your `src` folder. (assuming you have a backend project setup and are not just using the TypeScript Playground)

# Done

We're technically done, I mean, our original visualized example is actually complete.

```tsx
const data = <object>
    <name>Omran Jamal</name>
    <height>
        <object>
            <unit>cm</unit>
            <value>{173}</value>
        </object>
    </height>
    <hobbies>
        <array>
            <item>rebelling against the machine</item>
            <item>parks</item>
        </array>
    </hobbies>
</object>
```

Logging `data` to the console will yield us what we need.

## But ...

Here's a list of things that are left as an exercise to the reader.

1. The fact that `react-jsx` and `react` emit mode acts differently.
2. Fragments `<></>`, an important feature we take for granted in React.