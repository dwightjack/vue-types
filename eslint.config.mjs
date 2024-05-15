// @ts-check

import eslint from '@eslint/js'
import ts from 'typescript-eslint'
import prettier from 'eslint-plugin-prettier/recommended'

export default ts.config(
  eslint.configs.recommended,
  ...ts.configs.strict,
  ...ts.configs.stylistic,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': 0,
      '@typescript-eslint/no-explicit-any': 0,
    },
  },
  prettier,
  { ignores: ['**/dist', '**/node_modules', '**/shim', '**/*.vue'] },
)
