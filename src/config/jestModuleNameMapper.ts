const jestModuleNameMapper = () => {
  const moduleNames = [
    'controllers',
    'middlewares',
    'validation',
    'services',
    'database',
    'config',
    'models',
    'routes',
    'utils',
    'server',
    'store',
    'types',
    'data',
    'bin',
  ]

  const mapper = moduleNames.reduce(
    (acc, moduleName) => ({
      ...acc,
      [`^${moduleName}$`]: `<rootDir>/src/${
        moduleName.includes('.ts') ? `${moduleName}.ts` : moduleName
      }`,
    }),
    {}
  )

  return mapper
}

module.exports = jestModuleNameMapper()
