# Getting Started

[[toc]]

## Installation

### NPM package

```bash
npm install vue-types --save
# or
yarn add vue-types
```

### CDN delivered script

add the following script tags before your code

```html
<script src="https://unpkg.com/vue-types"></script>
```

## Usage with `eslint-plugin-vue`

When used in a project with [eslint-plugin-vue](https://github.com/vuejs/eslint-plugin-vue), the linter might report errors related to the `vue/require-default-prop` rule.

To prevent that error use [eslint-plugin-vue-types](https://github.com/dwightjack/eslint-plugin-vue-types)

## Production build

Vue.js does not validate components' props when used in a production build. If you're using a bundler such as Webpack or rollup you can shrink vue-types filesize by around **70%** (minified and gzipped) by removing the validation logic while preserving the library's API methods. To achieve that result setup an alias to `vue-types/dist/shim.m.js` (`vue-types/dist/shim.js` if you're using CommonJS modules).

If you're including the library via a `script` tag use the dedicated shim build file:

```html
<script src="https://unpkg.com/vue-types@latest/dist/shim.umd.js"></script>
```

**Note:** In order to use a specific version of the library change `@latest` with `@<version-number>`:

```html
<!-- use the shim from version 1.6.0 -->
<script src="https://unpkg.com/vue-types@1.6.0/dist/shim.umd.js"></script>
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
        'vue-types': require.resolve('vue-types/dist/shim.m.js'),
      }),
    },
  },
}
```

### Rollup

The following example will shim the module in rollup using [rollup-plugin-alias](https://github.com/rollup/rollup-plugin-alias) when `NODE_ENV` is set to `"production"`:

```js
// rollup.config.js
import alias from 'rollup-plugin-alias'

return {
  // ... configuration
  plugins: [
    // ...other plugins
    ...(process.env.NODE_ENV === 'production' && [
      alias({
        'vue-types': require.resolve('vue-types/dist/shim.m.js'),
      }),
    ]),
  ],
}
```

Note: If you are using [rollup-plugin-node-resolve](https://github.com/rollup/rollup-plugin-node-resolve) make sure to place the alias plugin **before** the resolve plugin.
