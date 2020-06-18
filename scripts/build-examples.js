const { join, resolve } = require('path')
const microbundle = require('microbundle')

;(async function () {
  const ROOT_DIR = resolve(__dirname, '../examples')

  console.log('Compiling examples...')

  const bundles = ['userlist', 'shape'].map((path) => {
    microbundle({
      entries: [join(ROOT_DIR, `./${path}/src/index.ts`)],
      output: `./${path}/dist`,
      tsconfig: join(ROOT_DIR, './tsconfig.json'),
      cwd: ROOT_DIR,
      format: 'iife',
      compress: false,
      external: 'vue,vue-types',
      globals: 'vue=Vue,vue-types=VueTypes',
    })
  })

  await Promise.all(bundles)
})()
