# vue-types

> Prop type definitions for [Vue.js](http://vuejs.org).

<p id="badges">
  <a href="https://www.npmjs.com/package/vue-types" target="_blank">
    <img alt="NPM package version" src="https://img.shields.io/npm/v/vue-types" />
  </a>
  <a href="https://www.npmjs.com/package/vue-types" target="_blank">
    <img alt="Code coverage" src="https://img.shields.io/codeclimate/dwightjack/vue-types" />
  </a>
</p>

**Note: This document is for VueTypes 6. If you are looking for an older versions, refer to [the documentation for v2~v5](https://vue-types-v5.codeful.dev/)**

## Introduction

`vue-types` is a collection of configurable [prop type](https://vuejs.org/guide/components/props.html) definitions for Vue.js components, inspired by React's `prop-types`.

[Try it now!](https://stackblitz.com/edit/vitejs-vite-exfrzex6?embed=1&file=src%2FApp.vue) or learn more at the [official documentation site](https://vue-types.codeful.dev/).

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
