/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/vitest.setup.ts'],
    include: ['**/__tests__/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts', '!src/**/*.{d,cjs}.ts'],
      reportsDirectory: 'coverage'
    }
  },
});
