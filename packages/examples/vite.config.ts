import { defineConfig } from 'vite'
import { fileURLToPath } from 'url'

const resolve = (name: string) => fileURLToPath(import.meta.resolve(name))

export default defineConfig({
  resolve: {
    alias: {
      vue2: resolve('vue2/dist/vue.esm.js'),
      vue3: resolve('vue3/dist/vue.esm-browser.js'),
      'vue-types': resolve('../core/src/index.ts'),
    },
  },
})
