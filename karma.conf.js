// Karma configuration
// Generated on Wed Oct 26 2016 17:54:27 GMT+0200 (CEST)

const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const babel = require('rollup-plugin-babel')
const replace = require('rollup-plugin-replace')
const stub = require('rollup-plugin-stub')
const globals = require('rollup-plugin-node-globals')
const builtins = require('rollup-plugin-node-builtins')

process.env.CHROME_BIN = require('puppeteer').executablePath()

const production = process.env.PRODUCTION === 'true'

//fixing mocha bug: https://github.com/karma-runner/karma-mocha/issues/203
const fixMocha = function(files) {
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
    frameworks: ['mocha', 'inline-mocha-fix'],

    plugins: [
      'karma-*',
      {
        'framework:inline-mocha-fix': ['factory', fixMocha],
      },
    ],

    // list of files / patterns to load in the browser
    files: [{ pattern: 'src/*.js', included: false }, 'test/**/*.test.js'],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      // add webpack as preprocessor
      'src/**/*.js': ['rollup'],
      'test/**/*.test.js': ['rollup'],
    },

    rollupPreprocessor: {
      plugins: [
        resolve({
          preferBuiltins: true,
        }),
        commonjs(),
        babel({
          exclude: 'node_modules/**',
        }),
        replace({
          'process.env.NODE_DEBUG': !production,
        }),
        stub(),
        globals(),
        builtins(),
      ],
      output: {
        format: 'iife',
        name: 'VueTypes',
        sourcemap: 'inline',
      },
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

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
