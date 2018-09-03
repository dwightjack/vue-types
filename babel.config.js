module.exports = (api) => {
  api && api.cache.using(() => process.env.NODE_ENV)

  const { BABEL_ENV } = process.env

  const plugins = []

  return {
    presets: [
      [
        '@babel/env',
        {
          modules: ['cjs', 'test'].includes(BABEL_ENV) ? 'commonjs' : false,
          loose: true
        }
      ]
    ],
    plugins
  }
}
