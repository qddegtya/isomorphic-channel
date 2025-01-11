module.exports = {
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^xajs$': '<rootDir>/test/__mocks__/xajs.js',
  },
  testMatch: ['**/test/**/*.test.js'],
}
