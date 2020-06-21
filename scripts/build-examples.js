const { join, resolve } = require('path')
const microbundle = require('microbundle')
const del = require('del')

;(async function () {
  const ROOT_DIR = resolve(__dirname, '../examples')

  process.env.NODE_ENV = 'production'

  console.log('Compiling examples...')

  const bundles = ['userlist', 'shape'].map(async (path) => {
    await del(resolve(ROOT_DIR, `./${path}/dist`))

    await microbundle({
      entries: [join(ROOT_DIR, `./${path}/src/index.ts`)],
      output: `./${path}/dist`,
      tsconfig: join(ROOT_DIR, './tsconfig.json'),
      cwd: ROOT_DIR,
      format: 'iife',
      compress: false,
      define: 'process.env.NODE_ENV="production"',
    })
  })

  await Promise.all(bundles)
})()
