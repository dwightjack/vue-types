---
title: Introduction
---

# VueTypes

VueTypes is a collection of configurable [prop validators](http://vuejs.org/guide/components.html#Props) for Vue.js, inspired by React `prop-types`.

[Try it now!](https://codesandbox.io/s/vue-types-2-demo-rbrdh)

::: warning VERSION NOTE
This is the documentation for VueTypes 2 and above. If you are using an older version, refer to the documentation [here](https://github.com/dwightjack/vue-types/blob/v1/README.md).

If you use **Vue 3**, make sure to use VueTypes 3 for better compatibility:

```sh
npm install vue-types@3
```

:::

## When to use

While basic prop validation in Vue.js is straight-forward and convenient, fine-grained validation can become verbose on complex components.

VueTypes offers a compact and fluent interface to define your project's props.

## Usage example

Imagine a typical Vue.js component with a set of props:

```js
export default {
  props: {
    id: {
      type: Number,
      default: 10,
    },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      validator(value) {
        return Number.isInteger(value)
      },
      default: 0,
    },
    nationality: String,
  },
  methods: {
    // ...
  },
}
```

While this component works perfectly fine, writing a lot of prop validation objects can become repetitive.

With VueTypes you could rewrite the same props like this:

```js
import VueTypes from 'vue-types'

export default {
  props: {
    id: VueTypes.number.def(10),
    name: VueTypes.string.isRequired,
    age: VueTypes.integer,
    nationality: VueTypes.string,
  },
  methods: {
    // ...
  },
}
```

## Individual validators import

Starting from version 2.0.0, you can import individual validators for an even more concise syntax:

```js
import { number, string, integer } from 'vue-types'

export default {
  props: {
    id: number().def(10),
    name: string().isRequired,
    age: integer().def(0),
    nationality: string(),
  },
  methods: {
    // ...
  },
}
```
