---
pageTitle: My Beef with OOP
title: My Beef With OOP
on-page-title-prefix: 🥴
short-description: It's bad for the programmer and their friends. It's always the wrong tool for every job.
published: 2024-06-22 02:00:00+6
edited: 2024-06-22 02:00:00+6
unlisted: true
highlight: true
tags:
  - oop
  - opinion
  - rant
  - essay
---

My team is asked specifically to steer 100% clear of OOP. This is an essay where I want to discuss 
why that is.

# Hard Things The Easy Way; Not The Other Way Round

The entire argument boils down to how hard it is. OOP is hard to write. Once it's written by a human
who cames mistakes, it's hard to fix. Once you are happy with what you have, and want to build on it
further, it's hard to extend.

I truly believe software engineering is hard when tackling a hard enough problem, which is why it's of 
paramount importance that we spend most of our time dealing with the hard parts of the problem and not the
hard parts of our tools. Our hard tool to uzse just happens to be OOP.

I hear a lot of arguments from OOP _fundamentalists_ that "of course it's hard, it's because I'm not doing
it right, No _TRUE_ OOP application that follows the OOP principles have this problem." Sounds a lot
like the ["No true Scotsman" fallacy](#), doesn't it?

To be honest, they'd be right. I'm actually doing it wrong. In this blog post, I'll outline with examples
of how certain things are quite hard to figure out in OOP and once figured out it's not an absolutely 
horrible experience. What I've come to realize that OOP suffers from the worst effects of entropy. There are
more ways to do OOP wrong and only one (or less) ways to do it right. In such an arrangement as time
(and commits) progresses is it more likely to be in a state of disorder or OOP be utopia?

Welcome to the article.

## TL;DR

1. Can OOP be done right? Maybe.
2. Are there more ways to do it right than doing it wrong? No.
3. Am I OCD enough to attempt to do it anyway? Absolutely not.
4. Do my users care? "What's OOP?" - My Users.

# Un-Atomic: The Readability & Refactoring Nightmare

Classes are a whole bunch of things together. They are initializer procedures, variable declarations and
other procedures all packed into one. This sounds great when you're building a software for the first time
the nightmare begins when you have to change this said software.

Every method that you declare on a class no longer works as an atomic unit.

Note:
1. Storing data in (highly) nested structures is fine tbh.
2. Mixing behaviour with the data is the root of all evil.
3. I hate the abstract animal examples. Let's build _real_ software.

Analogy:
1. You wouldn't demand a whiteboard to change its state on it's own.
2. You don't really care about the internal state of the whitebaord.

Problems:
1. Objects are just syntactic sugar over currying.
2. It's often impossible to read & refactor.
   1. Bound to variables in the object not just itself.
   2. Contruction of the object and invocation of the method are separate.
   3. Global-ish mutable state, hence not commutative.
   4. Worse without tools.
3. Interfaces kills the dream of a version 2, then themselves can cause tight coupling of the implementations.
4. Encapsulation is just hiding information from the very person that willed the information to exist.
5. Inheritance doesn't work because the world isn't a tree of things; it's a graph.
6. Versionability nightmare.
7. You spend a lot more time thinking where to put things and what to name them
   than actually writing code.
8. 
