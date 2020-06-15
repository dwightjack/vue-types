// Karma configuration
// Generated on Wed Oct 26 2016 17:54:27 GMT+0200 (CEST)

process.env.CHROME_BIN = require('puppeteer').executablePath()

//fixing mocha bug: https://github.com/karma-runner/karma-mocha/issues/203
const fixMocha = function (files) {
  files.unshift({
    pattern: 'https://unpkg.com/core-js-bundle@3.0.1/minified.js',
    included: true,
    served: true,
    watched: false,
  })
}

fixMocha.$inject = ['config.files']

module.exports = (config) => {
  if (
    Array.isArray(config.browsers) &&
    config.browsers[0] === 'ChromeHeadless'
  ) {
    process.env.CHROME_BIN = require('puppeteer').executablePath()
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'inline-mocha-fix', 'karma-typescript'],

    plugins: [
      'karma-*',
      {
        'framework:inline-mocha-fix': ['factory', fixMocha],
      },
    ],

    // list of files / patterns to load in the browser
    files: ['src/**/*.ts', 'test/**/*.test.ts'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.ts': 'karma-typescript',
      'test/**/*.test.ts': 'karma-typescript',
    },

    karmaTypescriptConfig: {
      reports: process.env.CIRCLECI
        ? {
            lcovonly: {
              directory: 'coverage',
              subdirectory: () => '',
              filename: 'lcov.info',
            },
          }
        : {
            text: '',
          },
      compilerOptions: {
        target: 'ES5',
        sourceMap: true,
        module: 'commonjs',
      },
      coverageOptions: {
        instrumentation: true,
      },
      bundlerOptions: {
        transforms: [require('karma-typescript-es6-transform')()],
        entrypoints: /\.test\.ts$/,
      },
      include: ['**/*.ts'],
      exclude: ['node_modules', 'examples/**/*.ts'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'karma-typescript'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    concurrency: Infinity,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
  })
}
