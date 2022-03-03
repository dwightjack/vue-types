/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./__tests__/vitest.setup.ts'],
    include: ['**/__tests__/**/*.test.ts'],
    coverage: {
      include: ['src/**/*.ts', '!src/**/*.{d,cjs}.ts'],
      reportsDirectory: 'coverage',
      enabled: true,
      reporter: ['text', 'lcov', 'json'],
    }
  },
});
