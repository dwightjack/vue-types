// @ts-check
import eslint from '@eslint/js'
import { defineConfig } from 'eslint/config'
import ts from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import globals from 'globals'

export default defineConfig(
  eslint.configs.recommended,
  ts.configs.strict,
  ts.configs.stylistic,
  {
    extends: [
      eslint.configs.recommended,
      ts.configs.strict,
      ts.configs.stylistic,
      vue.configs['flat/recommended'],
    ],
    files: ['**/*.vue'],
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
      'vue/singleline-html-element-content-newline': 0,
    },
  },
  {
    ignores: ['**/dist', '**/node_modules', '**/shim', '**/cache'],
  },
)
