module.exports = {
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'vue',
  // required to lint *.vue files
  env: {
    'browser': true,
    'mocha': true
  },
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': 0,
    'no-unused-vars': 1,
    'space-before-function-paren': 0,
    'padded-blocks': 0
  }
}
