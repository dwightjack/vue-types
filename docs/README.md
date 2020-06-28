# Introduction

`vue-types` is a collection of configurable [prop type](http://vuejs.org/guide/components.html#Props) definitions for Vue.js components, inspired by React `prop-types`.

[Try it now!](https://codesandbox.io/embed/vue-types-template-khfk4)

## When to use

While basic prop type definition in Vue is simple and convenient, detailed prop validation can become verbose on complex components.
This is the case for `vue-types`.

Instead of:

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
    },
    nationality: String,
  },
  methods: {
    // ...
  },
}
```

You may write:

```js
import VueTypes from 'vue-types'

export default {
  props: {
    id: VueTypes.number.def(10),
    name: VueTypes.string.isRequired,
    age: VueTypes.integer,
    // No need for `default` or `required` key, so keep it simple
    nationality: String,
  },
  methods: {
    // ...
  },
}
```
