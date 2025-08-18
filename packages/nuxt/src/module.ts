import {
  defineNuxtModule,
  extendViteConfig,
  extendWebpackConfig,
} from '@nuxt/kit'

export interface VueTypesNuxtOptions {
  shim?: boolean
}

export default defineNuxtModule<VueTypesNuxtOptions>({
  meta: {
    name: 'vue-types',
    configKey: 'vueTypes',
    compatibility: {
      nuxt: '>=3.0.0',
    },
  },

  setup(options, nuxt) {
    if ((nuxt.options.dev && options.shim !== true) || options.shim === false) {
      return
    }
    extendViteConfig((config) => {
      if (!config.resolve) {
        config.resolve = {}
      }
      if (Array.isArray(config.resolve.alias)) {
        config.resolve.alias.push({
          find: 'vue-types',
          replace: 'vue-types/shim',
        })
      } else {
        config.resolve.alias = {
          ...config.resolve.alias,
          'vue-types': 'vue-types/shim',
        }
      }
    })
    extendWebpackConfig((config) => {
      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve?.alias,
          'vue-types': 'vue-types/shim',
        },
      }
    })
  },
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    vueTypes?: VueTypesNuxtOptions
  }
  interface NuxtOptions {
    vueTypes?: VueTypesNuxtOptions
  }
}
