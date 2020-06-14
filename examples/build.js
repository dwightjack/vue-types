const { join } = require('path')
const microbundle = require('microbundle')

;(async function () {
  await microbundle({
    entries: [join(__dirname, './userlist/src/index.ts')],
    output: './userlist/dist',
    tsconfig: join(__dirname, './tsconfig.json'),
    cwd: __dirname,
    format: 'iife',
    compress: false,
    external: 'vue,vue-types',
    globals: 'vue=Vue,vue-types=VueTypes',
  })
})()
