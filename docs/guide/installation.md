# Installation

::: warning VERSION NOTE
This guide covers VueTypes 2+.

- VueTypes 2 is compatible with **Vue 1 and 2**.
- VueTypes 4 is compatible with **Vue 2 and Vue 3**.
  :::

## NPM package

```bash
npm install vue-types --save
```

## CDN delivered script

Add the following script tags before your code

```html
<script src="https://unpkg.com/vue-types"></script>
```

## Usage with `eslint-plugin-vue`

When used in a project with [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), the linter might report errors related to the `vue/require-default-prop` rule.

To prevent that error use [eslint-plugin-vue-types](https://github.com/dwightjack/eslint-plugin-vue-types).

## Usage with bundlers

Starting from version 4, VueTypes is published as a native ESM module with CommonJS and UMD support.

Modern bundlers and tools should be able to automatically pick the correct version based on your configuration.

Anyway, here is the list of available entry points:

- `vue-types.modern.js`: ES module for environments [supporting it](https://caniuse.com/es6-module). This is the default entry point for Node 14+, Webpack 5+, Rollup and other tools with native support for ES Modules (like [Vite](https://vitejs.dev/) and [Snowpack](https://www.snowpack.dev/)).
- `vue-types.m.js`: ES5 compiled version exported as ES module. This is the default entry point for Webpack 4 and frameworks like [Nuxt 2](https://nuxtjs.org/)
- `vue-types.cjs`: ES5 compiled version exported as CommonJS module. This is the default entry point for Node 12 and older and tools not supporting ES Modules.
- `vue-types.umd.js`: ES5 compiled version bundled as UMD module. This entry point can be used when loading VueTypes from a `<script src="...">` tag or from a CDN. It's the default entry point for [unpkg](https://unpkg.com/).

## Production build

Vue.js does not validate components' props when used in a production build. If you're using a bundler such as Webpack or rollup you can shrink VueTypes file size by around **70%** (minified and gzipped) by removing the validation logic while preserving the library's API methods. To achieve that result, VueTypes ships with a `shim` module that can be used as alias in the production build.

| Full Library entry point | Shim entry point |
| ------------------------ | ---------------- |
| `vue-types.modern.js`    | `shim.modern.js` |
| `vue-types.m.js`         | `shim.m.js`      |
| `vue-types.cjs`          | `shim.cjs`       |
| `vue-types.umd.js`       | `shim.umd.js`    |

### CDN usage

If you're including the library via a `script` tag, use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@latest/dist/shim.umd.js"></script>
```

**Note:** In order to use a specific version of the library change `@latest` with `@<version-number>`:

```html
<!-- use the shim from version 2.0.0 -->
<script src="https://unpkg.com/vue-types@2.0.0/dist/shim.umd.js"></script>
```

### Webpack 4 and earlier

The following example will shim the module in Webpack by adding an [alias field](https://webpack.js.org/configuration/resolve/#resolve-alias) to the configuration when `NODE_ENV` is set to `"production"`:

```js
// webpack.config.js

return {
  // ... configuration
  resolve: {
    alias: {
      // ... other aliases
      ...(process.env.NODE_ENV === 'production' && {
        'vue-types': require.resolve('vue-types/dist/shim.m.js'),
      }),
    },
  },
}
```

### Webpack 5

The following example will shim the module in Webpack by adding an [alias field](https://webpack.js.org/configuration/resolve/#resolve-alias) to the configuration when `NODE_ENV` is set to `"production"`:

```js
// webpack.config.js

return {
  // ... configuration
  resolve: {
    alias: {
      // ... other aliases
      'vue-types': 'vue-types/shim',
      },
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

Note: If you are using [@rollup/plugin-node-resolve](https://www.npmjs.com/package/@rollup/plugin-node-resolve) make sure to place the alias plugin **before** the resolve plugin.
