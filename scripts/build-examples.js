const { join, resolve } = require('path')
const microbundle = require('microbundle')
const del = require('del')

const BASE_PATH = resolve(__dirname, '../examples')

;(async function () {
  console.log('Compiling examples...')
  const bundles = ['userlist', 'shape'].map(async (path) => {
    console.log(join(BASE_PATH, `./${path}/dist`))
    await del(join(BASE_PATH, `./${path}/dist`))

    await microbundle({
      entries: [join(BASE_PATH, `./${path}/src/index.ts`)],
      output: `./${path}/dist`,
      tsconfig: join(BASE_PATH, './tsconfig.json'),
      cwd: BASE_PATH,
      format: 'iife',
      compress: false,
      external: 'vue,vue-types',
      globals: 'vue=Vue,vue-types=VueTypes',
    })
  })
  await Promise.all(bundles)
})()
