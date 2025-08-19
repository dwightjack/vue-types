# Nuxt

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
