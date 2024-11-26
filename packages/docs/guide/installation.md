# Installation

::: warning VERSION NOTE
This guide covers VueTypes 2+.

- **VueTypes 6+ is compatible with Vue 3**.
- VueTypes 4+ is compatible with **Vue 2 and Vue 3**.
- VueTypes 2 is compatible with **Vue 1 and 2**.
  :::

## NPM package

```bash
npm install vue-types --save
```

## CDN delivered script

Add the following script tags before your code

```html
<script src="https://unpkg.com/vue-types@6"></script>

<!-- Or -->

<script src="https://cdn.jsdelivr.net/npm/vue-types@6/dist/index.umd.js"></script>
```

In modern browsers [supporting ES Modules](https://caniuse.com/es6-module) you can import the library like this:

```html
<script type="module">
  import { string, number } from 'https://unpkg.com/vue-types@6?module'
</script>

<!-- Or -->

<script type="module">
  import { string, number } from 'https://cdn.jsdelivr.net/npm/vue-types@6/+esm'
</script>
```

## Usage with bundlers

Starting from version 4, VueTypes is published as a **native ESM module** with CommonJS and UMD support.

Modern bundlers and tools should be able to automatically pick the correct entry point based on your configuration.

```js
import { string, oneOf } from 'vue-types' // or: import VueTypes from 'vue-types';
```

## Production build

Vue.js does not validate components' props when used in a production build. If you're using a bundler such as Webpack or rollup, you can shrink VueTypes file size by around **70%** (minified and gzipped) by removing the validation logic while preserving the library's API methods. To achieve that result, VueTypes ships with a `vue-types/shim` module that can be used as alias in production builds.

::: danger NOTE
Note that all validation functions in the shim version (including `validateType` and `VueTypes.utils.validate`) always return `true`.
:::

By just aliasing `vue-types` to `vue-types/shim`, bundlers should be able to pick the module type that fits your configuration (ES, CommonJS, ...).

See below for common configuration scenarios.

::: details More details

For reference, here is a table showing the full and shim versions of the library for each module system.

| Module system | Full Library entry point | Shim entry point    |
| ------------- | ------------------------ | ------------------- |
| ES5 ES        | `index.mjs`              | `shim/index.mjs`    |
| CommonJS      | `index.cjs`              | `shim/index.cjs`    |
| UMD           | `index.umd.js`           | `shim/index.umd.js` |

:::

### CDN usage

If you're including the library via a `script` tag, use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@6/shim.umd.js"></script>
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
