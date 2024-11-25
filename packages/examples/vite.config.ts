import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

const resolve = (name: string) => fileURLToPath(import.meta.resolve(name))

export default defineConfig({
  resolve: {
    alias: {
      vue: resolve('vue/dist/vue.esm-browser.js'),
      'vue-types': resolve('../core/src/index.ts'),
    },
  },
})
