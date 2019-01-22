import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import replace from 'rollup-plugin-replace'
import alias from 'rollup-plugin-alias'
import serve from 'rollup-plugin-serve'
import path from 'path'

const PRODUCTION = false

const plugins = [
  alias({
    'vue': path.resolve(__dirname, '../node_modules/vue/dist', PRODUCTION ? 'vue.min.js' : 'vue.js'),
    'vue-types': path.resolve(__dirname, '../src', PRODUCTION ? 'shim.js' : 'index.js')
  }),
  resolve(),
  commonjs(),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify(PRODUCTION ? 'production' : 'development'),
  }),
  serve({
    contentBase: ['examples'],
    host: '0.0.0.0',
    port: 8080,
  }),
]

export default [
  'shape',
  'userlist'
].map((folder) =>({
  input: path.join(__dirname, folder, 'src/index.js'),
  output: {
    format: 'iife',
    name: 'vueTypesDemo',
    sourcemap: true,
    file: path.join(__dirname, folder, 'dist/bundle.js')
  },
  plugins
}))
