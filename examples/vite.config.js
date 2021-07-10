import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      'vue-types': [resolve(__dirname, '../src/index.ts')],
      vue2: [
        resolve(__dirname, '../node_modules/vue2/dist/vue.esm.browser.js'),
      ],
      vue3: [
        resolve(__dirname, '../node_modules/vue3/dist/vue.esm-browser.js'),
      ],
    },
  },
}

export default config
