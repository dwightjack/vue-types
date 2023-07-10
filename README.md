# vue-types

> Prop type definitions for [Vue.js](http://vuejs.org).

<p id="badges">
  <a href="https://www.npmjs.com/package/vue-types" target="_blank">
    <img alt="NPM package version" src="https://img.shields.io/npm/v/vue-types" />
  </a>
  <a href="https://circleci.com/gh/dwightjack/vue-types" target="_blank">
    <img alt="CircleCI status" src="https://circleci.com/gh/dwightjack/vue-types.svg?style=shield" />
  </a>
<a href="https://www.npmjs.com/package/vue-types" target="_blank">
    <img alt="Code coverage" src="https://img.shields.io/codeclimate/dwightjack/vue-types" />
  </a>

</p>

**Note: This document is for VueTypes 5. If you are looking for an older versions, refer to the `v1~v4` branches.**

## Introduction

`vue-types` is a collection of configurable [prop type](http://vuejs.org/guide/components.html#Props) definitions for Vue.js components, inspired by React's `prop-types`.

[Try it now!](https://stackblitz.com/edit/vitejs-vite-83cnar?file=src/App.vue) or learn more at the [official documentation site](https://dwightjack.github.io/vue-types/).

## Run examples

1. Install dependencies: `pnpm install`
2. Run script: `pnpm run examples:dev`
3. Wait for the server and bundler to start-up

## Run docs on localhost

1. Install dependencies: `pnpm install`
2. Run script: `pnpm run docs:dev`

## Contributing

1. Clone this repository
1. Install dependencies: `pnpm install`
1. Make your changes
1. Update or add tests in `packages/core/__tests__/`
1. Verify that everything works: `pnpm -r run lint && pnpm -r test`
1. Submit a Pull Request

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2016 - present Marco Solazzi
