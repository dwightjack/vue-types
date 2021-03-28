// Karma configuration
// Generated on Wed Oct 26 2016 17:54:27 GMT+0200 (CEST)

const baseConfig = require('./karma.conf')
const pkg = require('./package.json')

const customLaunchers = {
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
    version: 'latest',
  },
  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    version: 'latest',
    platform: 'macOS 10.13',
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
    version: '18.17763',
  },
}

module.exports = function (config) {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    //eslint-disable-next-line no-console
    console.log(
      'Make sure the SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables are set.',
    )
    //eslint-disable-next-line no-process-exit
    process.exit(1)
  }

  baseConfig(config)

  config.set({
    sauceLabs: {
      testName: 'vue-types',
      recordScreenshots: false,
      build: `${pkg.version}-${Date.now()}`,
    },

    files: [require.resolve('core-js-bundle/minified.js'), ...config.files],
    customLaunchers,

    browsers: Object.keys(customLaunchers),

    reporters: ['progress', 'saucelabs'],

    singleRun: true,

    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
    browserDisconnectTimeout: 300000, // default 2000
    browserDisconnectTolerance: 1, // default 0
  })
}
