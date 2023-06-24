module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js'],
  verbose: true,
  forceExit: true,

  moduleNameMapper: {
    '^config$': '<rootDir>/src/config',
    '^utils$': '<rootDir>/src/utils',
    '^controllers$': '<rootDir>/src/controllers',
    '^middlewares$': '<rootDir>/src/middlewares',
  },
}
