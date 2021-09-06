/* global module, require */

/**
 * @typedef {Object} ModuleOptions
 *
 * @property {boolean} [shim]
 */

/**
 * @type {import('@nuxt/types').Module}
 * @param {ModuleOptions} moduleOptions
 */
module.exports = function VueTypesModule(moduleOptions = {}) {
  this.extendBuild(function (config, ctx) {
    if (
      (ctx.isDev && moduleOptions.shim !== true) ||
      moduleOptions.shim === false
    ) {
      return
    }
    if (!config.resolve) {
      config.resolve = {}
    }
    config.resolve.alias = Object.assign(config.resolve.alias || {}, {
      'vue-types': 'vue-types/shim',
    })
  })
}

module.exports.meta = require('./package.json')
