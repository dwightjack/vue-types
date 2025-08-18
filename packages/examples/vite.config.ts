import { defineConfig } from 'vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      vue: require.resolve('vue/dist/vue.esm-browser.js'),
      'vue-types': resolve(__dirname, '../core/src/index.ts'),
    },
  },
})
