import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      vue2: require.resolve('vue2/dist/vue.esm.js'),
      vue3: require.resolve('vue3/dist/vue.esm-browser.js'),
      'vue-types': require.resolve('../core/src/index.ts'),
    },
  },
})
