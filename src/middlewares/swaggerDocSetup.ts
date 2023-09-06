import SwaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const loadYamlFile = (path: string, key?: string) => {
  try {
    const yaml = YAML.load(`./src/swaggerDocs/${path}`)
    return key ? yaml[key] : yaml
  } catch (error) {
    return {}
  }
}

const appendYamlFiles = (target: {}, directory: string, files: string[]) => {
  files.forEach((file) => {
    const section = loadYamlFile(`${directory}/${file}.yaml`)
    Object.assign(target, section)
  })
}

export const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = {
    openapi: '3.0.0',
    produces: ['application/json'],
    info: loadYamlFile('info.yaml'),
    servers: loadYamlFile('servers.yaml'),
    components: {
      securitySchemes: loadYamlFile('securitySchemes.yaml'),
      responses: loadYamlFile('responses.yaml'),
      schemas: {},
      examples: {},
    },
    paths: {},
  }

  const schemaYamlFiles = [
    'User',
    'Semester',
    'LearningActivity',
    'University',
    'PaginationInfo',
    'Criterias',
  ]

  appendYamlFiles(
    swaggerDocument.components.schemas,
    'schemas',
    schemaYamlFiles
  )

  const controllerYamlFiles = [
    'authentication',
    'user',
    'semesters',
    'learningActivities',
    'universities',
  ]
  appendYamlFiles(swaggerDocument.paths, 'controllers', controllerYamlFiles)

  const partialYamlFiles = ['SemesterPartial', 'LearningActivityPartial']
  appendYamlFiles(
    swaggerDocument.components.schemas,
    'schemas/partials',
    partialYamlFiles
  )

  const examplesYamlFiles = ['LearningActivitiesExample']
  appendYamlFiles(
    swaggerDocument.components.examples,
    'examples',
    examplesYamlFiles
  )

  return SwaggerUI.setup(swaggerDocument, options)
}
