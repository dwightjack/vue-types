const microbundle = require('microbundle')

;(async function () {
  await microbundle({
    input: './userlist/src/index.js',
    name: 'userlist',
    output: './userlist/dist',
    tsconfig: './tsconfig.json',
    cwd: __dirname,
    format: 'iife',
  })
})()
