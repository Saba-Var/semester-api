const moduleNameMapper = require('./src/config/jestModuleNameMapper.ts')

module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  forceExit: true,
  moduleNameMapper,
}
