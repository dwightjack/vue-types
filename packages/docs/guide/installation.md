# Installation

::: warning VERSION NOTE
This guide covers VueTypes 6+.

- **VueTypes 6+ is compatible with Vue 3**.
- **VueTypes 4+ is compatible with Vue 2 and Vue 3**.
- **VueTypes 2 is compatible with Vue 1 and 2**.
  :::

## NPM Package

To install VueTypes via npm, use the following command:

```bash
npm install vue-types --save
```

## CDN Delivered Script

Include the following script tags before your code:

```html
<script src="https://unpkg.com/vue-types@6"></script>

<!-- Or -->

<script src="https://cdn.jsdelivr.net/npm/vue-types@6/dist/index.umd.js"></script>
```

For modern browsers [supporting ES Modules](https://caniuse.com/es6-module), you can import the library as follows:

```html
<script type="module">
  import { string, number } from 'https://unpkg.com/vue-types@6?module'
</script>

<!-- Or -->

<script type="module">
  import { string, number } from 'https://cdn.jsdelivr.net/npm/vue-types@6/+esm'
</script>
```

## Usage with Bundlers

VueTypes is published as a **native ESM module** with CommonJS and UMD support.
Modern bundlers and tools will automatically select the appropriate entry point based on your configuration.

```js
import { string, oneOf } from 'vue-types' // or: import VueTypes from 'vue-types';
```

## Production Build

Vue.js does not validate component props in production builds. By using a bundler such as Webpack or Rollup, you can reduce the VueTypes file size by approximately **70%** (minified and gzipped) by removing validation logic while preserving the library's API methods. VueTypes provides a `vue-types/shim` module that can be used as an alias in production builds to achieve this optimization.

::: danger NOTE
In the shim version, all validation functions (including `validateType` and `VueTypes.utils.validate`) always return `true`.
:::

By aliasing `vue-types` to `vue-types/shim`, bundlers will automatically select the appropriate module type (ES, CommonJS, etc.) based on your configuration.

### Common Configuration Scenarios

The following table displays the full and shim versions of the library for different module systems:

| Module System | Full Library Entry Point | Shim Entry Point |
| ------------- | ------------------------ | ---------------- |
| ES6 (ES)      | `index.mjs`              | `shim.mjs`       |
| CommonJS      | `index.cjs`              | `shim.cjs`       |
| UMD           | `index.umd.js`           | `shim.umd.js`    |

### CDN Usage

If including the library via a `script` tag, use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@6/shim.umd.js"></script>
```

### Vite Configuration

Use [conditional config](https://vitejs.dev/config/#conditional-config) to set a production-only [alias](https://vitejs.dev/config/#resolve-alias):

```js
// vite.config.js

export default function ({ mode }) {
  return {
    // Other config settings
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

### Webpack Configuration

To use the shim in Webpack, add an [alias field](https://webpack.js.org/configuration/resolve/#resolve-alias) to the configuration when `NODE_ENV` is set to `"production"`:

```js
// webpack.config.js

return {
  // Other configuration settings
  resolve: {
    alias: {
      // Other aliases
      ...(process.env.NODE_ENV === 'production' && {
        'vue-types': 'vue-types/shim',
      }),
    },
  },
}
```

### Rollup Configuration

Use [@rollup/plugin-alias](https://www.npmjs.com/package/@rollup/plugin-alias) to apply the shim in Rollup:

```js
// rollup.config.js
import alias from '@rollup/plugin-alias'

return {
  // Other configuration settings
  plugins: [
    alias({
      entries: {
        'vue-types': 'vue-types/shim',
      },
    }),
    // Other plugins
  ],
}
```

::: warning
If using [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve), place the alias plugin **before** the resolve plugin.
:::

### Nuxt Configuration

VueTypes provides a Nuxt module that automatically enables the shim for production builds:

```sh
npm install vue-types-nuxt --save-dev
```

```ts
// nuxt.config.ts

export default {
  // Other settings
  modules: ['vue-types-nuxt'],
}
```

To explicitly enable the shim, set the `shim` option:

```ts
// nuxt.config.ts

export default {
  modules: ['vue-types-nuxt'],

  // Enable the shim even during development
  vueTypes: {
    shim: true,
  },
}
```
