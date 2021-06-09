module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./__tests__/jest.setup.js'],
  testMatch: ['**/__tests__/**/*.test.ts'],
}
