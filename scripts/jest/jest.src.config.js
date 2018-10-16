const config = {
  transform: {
    '^.+\\.(t|j)s$': require.resolve('./transformer.js')
  },
  testMatch: ['<rootDir>/packages/**/__test__/?(*.)+(spec|test).js'],
  moduleDirectories: ['src', 'node_modules'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testURL: 'http://localhost',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  rootDir: process.cwd(),
  roots: ['<rootDir>/packages', '<rootDir>/scripts'],
  collectCoverageFrom: ['packages/!(laksa-hd-wallet)/src/*.js'],
  timers: 'fake',
  setupTestFrameworkScriptFile: '<rootDir>/scripts/jest/jest.setup.js',
  testEnvironment: process.env.NODE_ENV === 'development' ? 'node' : 'jsdom',
  collectCoverage: true
}

module.exports = config
