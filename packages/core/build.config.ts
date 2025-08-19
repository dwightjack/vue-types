import { type BuildConfig, defineBuildConfig } from 'unbuild'
import { renameSync } from 'node:fs'
import { resolve } from 'node:path'

const umd = (entryName: string): BuildConfig => ({
  entries: [
    {
      builder: 'rollup',
      name: `${entryName}.umd`,
      input: `./src/${entryName}.ts`,
    },
  ],
  rollup: {
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
    },
    output: {
      format: 'umd',
      name: 'VueTypes',
      exports: 'named',
      inlineDynamicImports: true,
    },
    esbuild: {
      target: 'es2016',
      minify: true,
    },
  },
  hooks: {
    'build:done': function ({ options }) {
      renameSync(
        resolve(options.outDir, `${entryName}.umd.mjs`),
        resolve(options.outDir, `${entryName}.umd.js`),
      )
    },
  },
  failOnWarn: false,
})

export default defineBuildConfig([
  {
    clean: true,
    sourcemap: true,
    entries: ['./src/index.ts', './src/shim.ts'],
    failOnWarn: false,
    rollup: {
      emitCJS: true,
      cjsBridge: true,
      inlineDependencies: true,
      output: {
        exports: 'named',
      },
    },
    declaration: true,
  },
  umd('index'),
  umd('shim'),
])
