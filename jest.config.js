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
    '^models$': '<rootDir>/src/models',
    '^services$': '<rootDir>/src/services',
    '^routes$': '<rootDir>/src/routes',
    '^store$': '<rootDir>/src/store',
    '^types.d$': '<rootDir>/src/types.d.ts',
    '^validationSchemas$': '<rootDir>/src/validationSchemas',
    '^controllers/authController$':
      '<rootDir>/src/controllers/authController.ts',
    '^database$': '<rootDir>/src/database',
    '^server': '<rootDir>/src/server.ts',
  },
}
