// @ts-check

import eslint from '@eslint/js'
import ts from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  {
    extends: [
      eslint.configs.recommended,
      ...ts.configs.strict,
      ...ts.configs.stylistic,
      ...vue.configs['flat/recommended'],
    ],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        parser: ts.parser,
      },
    },
    rules: {
      'vue/one-component-per-file': 0,
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
  prettier,
  {
    ignores: ['**/dist', '**/node_modules', '**/shim', '**/*.vue', '**/cache'],
  },
)
