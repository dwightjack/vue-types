const { join } = require('path')
const microbundle = require('microbundle')

;(async function () {
  console.log('Compiling examples...')
  const bundles = ['userlist', 'shape'].map((path) => {
    microbundle({
      entries: [join(__dirname, `./${path}/src/index.ts`)],
      output: `./${path}/dist`,
      tsconfig: join(__dirname, './tsconfig.json'),
      cwd: __dirname,
      format: 'iife',
      compress: false,
      external: 'vue,vue-types',
      globals: 'vue=Vue,vue-types=VueTypes',
    })
  })
})()
