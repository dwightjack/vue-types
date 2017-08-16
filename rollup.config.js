import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import bundlesize from 'rollup-plugin-bundle-size'

import { version, name, license, author, homepage } from './package.json'

const banner = `
/*! ${name} - v${version}
 * ${homepage}
 * Copyright (c) ${(new Date().getFullYear())} - ${author};
 * Licensed ${license}
 */
`

const plugins = [
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
]

const baseConfig = {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'VueTypes',
  banner,
  sourceMap: true
}

export default [
  Object.assign({
    dest: 'umd/vue-types.js',
    plugins: [replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    }), ...plugins, bundlesize()]
  }, baseConfig),
  Object.assign({
    dest: 'umd/vue-types.min.js',
    plugins: [replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }), ...plugins, uglify({
      warnings: false,
      mangle: true,
      compress: {
        pure_funcs: ['warn']
      },
      output: {
        comments: /^!/
      }
    }), bundlesize()]
  }, baseConfig)
]
