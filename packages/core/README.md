# vue-types

> Prop type definitions for [Vue.js](http://vuejs.org).

`vue-types` is a collection of configurable [prop validators](https://vuejs.org/guide/components/props.html#prop-validation) for Vue.js inspired by React's `prop-types`. It offers a compact and fluent interface to define your component props.

**Starting from v6, `vue-types` is only compatible with Vue 3.** For older versions, see the [v2~v5 documentation](https://vue-types-v5.codeful.dev/).

[Try it now!](https://stackblitz.com/edit/vitejs-vite-exfrzex6?embed=1&file=src%2FApp.vue) or learn more at the [official documentation site](https://vue-types.codeful.dev/).

## Installation

```bash
npm install vue-types --save
```

## Usage

```ts
import { defineComponent } from 'vue'
import { number, string, integer } from 'vue-types'

export default defineComponent({
  props: {
    id: number().def(10),
    name: string().isRequired,
    age: integer().def(0),
    nationality: string(),
  },
})
```

It works with `<script setup>` too:

```ts
defineProps({
  id: number().def(10),
  name: string().isRequired,
  age: integer().def(0),
  nationality: string(),
})
```

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 - present Marco Solazzi
