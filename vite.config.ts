/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: [resolve(__dirname, './vitest.setup.ts')],
    include: ['__tests__/**/*.test.ts'],
    coverage: {
      provider: 'c8',
      include: ['src/**/*.ts', '!src/**/*.{d,cjs}.ts'],
      reportsDirectory: 'coverage',
      reporter: ['text', ['lcov', { projectRoot: __dirname }], 'json'],
    },
  },
})
