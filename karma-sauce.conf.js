// Karma configuration
// Generated on Wed Oct 26 2016 17:54:27 GMT+0200 (CEST)

const baseConfig = require('./karma.conf')
const pkg = require('./package.json')

const customLaunchers = {
  sl_chrome: {
    base: 'SauceLabs',
    browserName: 'chrome',
    platform: 'Windows 10',
    version: 'latest',
  },
  sl_firefox: {
    base: 'SauceLabs',
    browserName: 'firefox',
    platform: 'Windows 10',
    version: 'latest',
  },

  sl_mac_safari: {
    base: 'SauceLabs',
    browserName: 'safari',
    platform: 'OS X 10.10',
  },

  sl_ie_9: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 7',
    version: '9',
  },
  sl_ie_11: {
    base: 'SauceLabs',
    browserName: 'internet explorer',
    platform: 'Windows 8.1',
    version: '11',
  },
  sl_edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    platform: 'Windows 10',
  },

  sl_android_5_1: {
    base: 'SauceLabs',
    browserName: 'android',
    version: '5.1',
  },
  sl_ios_safari_10_3: {
    base: 'SauceLabs',
    browserName: 'iphone',
    version: '10.3',
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

    customLaunchers,

    browsers: Object.keys(customLaunchers),

    reporters: ['mocha', 'saucelabs'],

    singleRun: true,

    captureTimeout: 300000,
    browserNoActivityTimeout: 300000,
  })
}
