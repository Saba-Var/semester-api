import { loadYamlFile, appendYamlFiles } from 'utils'
import SwaggerUI from 'swagger-ui-express'

const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = {
    openapi: '3.0.0',
    info: loadYamlFile('info.yaml'),
    servers: loadYamlFile('servers.yaml'),
    components: {
      securitySchemes: loadYamlFile('securitySchemes.yaml'),
      responses: loadYamlFile('responses.yaml'),
      schemas: {},
    },
    paths: {},
  }

  const schemaYamlFiles = ['User', 'Semester']
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
  ]
  appendYamlFiles(swaggerDocument.paths, 'controllers', controllerYamlFiles)

  const partialYamlFiles = ['SemesterPartial']
  appendYamlFiles(
    swaggerDocument.components.schemas,
    'schemas/partials',
    partialYamlFiles
  )

  return SwaggerUI.setup(swaggerDocument, options)
}

export default swaggerDocSetup
