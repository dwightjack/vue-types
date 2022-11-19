# Installation

::: warning VERSION NOTE
This guide covers VueTypes 2+.

- VueTypes 2 is compatible with **Vue 1 and 2**.
- VueTypes 4+ is compatible with **Vue 2 and Vue 3**.
  :::

## NPM package

```bash
npm install vue-types --save
```

## CDN delivered script

Add the following script tags before your code

```html
<script src="https://unpkg.com/vue-types@5"></script>

<!-- Or -->

<script src="https://cdn.jsdelivr.net/npm/vue-types@5/dist/vue-types.umd.js"></script>
```

In modern browsers [supporting ES Modules](https://caniuse.com/es6-module) you can import the library like this:

```html
<script type="module">
  import { string, number } from 'https://unpkg.com/vue-types@5?module'
</script>

<!-- Or -->

<script type="module">
  import { string, number } from 'https://cdn.jsdelivr.net/npm/vue-types@5/+esm'
</script>
```

## Usage with bundlers

Starting from version 4, VueTypes is published as a **native ESM module** with CommonJS and UMD support.

Modern bundlers and tools should be able to automatically pick the correct entry point based on your configuration.

```js
import { string, oneOf } from 'vue-types' // or: import VueTypes from 'vue-types';
```

::: details More details

For reference, here is the list of available entry points:

- `vue-types.modern.js`: ES module for environments [supporting it](https://caniuse.com/es6-module). This is the default entry point for Node 14+, Webpack 5+, Rollup and other tools with native support for ES Modules (like [Vite](https://vitejs.dev/), [Nuxt 3](https://nuxt.com/), Vue CLI 5 and [Snowpack](https://www.snowpack.dev/)).
- `vue-types.m.js`: ES5 compiled version exported as ES module. This is the default entry point for Webpack 4 and frameworks like [Nuxt 2](https://nuxtjs.org/) and [Vue CLI 4](https://cli.vuejs.org/)
- `vue-types.cjs`: ES5 compiled version exported as CommonJS module. This is the default entry point for Node 12 and older and tools not supporting ES Modules.
- `vue-types.umd.js`: ES5 compiled version bundled as UMD module. This entry point can be used when loading VueTypes from a `<script src="...">` tag or from a CDN. It's the default entry point for [unpkg](https://unpkg.com/).

:::

## Production build

Vue.js does not validate components' props when used in a production build. If you're using a bundler such as Webpack or rollup, you can shrink VueTypes file size by around **70%** (minified and gzipped) by removing the validation logic while preserving the library's API methods. To achieve that result, VueTypes ships with a `vue-types/shim` module that can be used as alias in production builds.

By just aliasing `vue-types` to `vue-types/shim`, bundlers should be able to pick the module type that fits your configuration (ES, CommonJS, ...).

See below for common configuration scenarios.

::: details More details

For reference, here is a table showing the full and shim versions of the library for each module system.

| Module system | Full Library entry point | Shim entry point       |
| ------------- | ------------------------ | ---------------------- |
| Modern ES     | `vue-types.modern.js`    | `shim/index.modern.js` |
| ES5 ES        | `vue-types.m.js`         | `shim/index.m.js`      |
| CommonJS      | `vue-types.cjs`          | `shim/index.cjs.js`    |
| UMD           | `vue-types.umd.js`       | `shim/index.umd.js`    |

:::

### CDN usage

If you're including the library via a `script` tag, use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@5/shim/index.umd.js"></script>
```

### Vite

You can use the [conditional config](https://vitejs.dev/config/#conditional-config) feature to set a production-only [alias](https://vitejs.dev/config/#resolve-alias):

```js
// vite.config.js

export default function ({ mode }) {
  return {
    // ... other config settings
    resolve: {
      ...(mode === 'production' && {
        alias: {
          'vue-types': 'vue-types/shim',
        },
      }),
    },
  }
}
```

### Webpack

The following example will shim the module in Webpack by adding an [alias field](https://webpack.js.org/configuration/resolve/#resolve-alias) to the configuration when `NODE_ENV` is set to `"production"`:

```js
// webpack.config.js

return {
  // ... configuration
  resolve: {
    alias: {
      // ... other aliases
      ...(process.env.NODE_ENV === 'production' && {
        'vue-types': 'vue-types/shim',
      }),
    },
  },
}
```

### Rollup

The following example will shim the module in rollup using [@rollup/plugin-alias](https://www.npmjs.com/package/@rollup/plugin-alias):

```js
// rollup.config.js
import alias from '@rollup/plugin-alias'

return {
  // ... configuration
  plugins: [
    alias({
      entries: {
        'vue-types': 'vue-types/shim',
      },
    }),
    // ...other plugins
  ],
}
```

::: warning
If you are using [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve) make sure to place the alias plugin **before** the resolve plugin.

:::

### Nuxt

VueTypes provides a Nuxt module that will automatically enable the shim for production builds:

```sh
npm install vue-types-nuxt --save-dev
```

```ts
// nuxt.config.ts

export default {
  // ...
  modules: ['vue-types-nuxt'],
}
```

::: warning
In projects using Nuxt 2, use the `buildModules` options:

```js
// nuxt.config.js

export default {
  // ...
  buildModules: ['vue-types-nuxt'],
}
```

:::

The modules accepts a `shim` boolean option to forcefully enable / disable the shim:

```ts
// nuxt.config.ts

export default {
  modules: ['vue-types-nuxt'],

  // use the shim even during development
  vueTypes: {
    shim: true,
  },
}
```
