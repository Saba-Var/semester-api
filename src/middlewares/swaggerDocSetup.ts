import SwaggerUI from 'swagger-ui-express'
import { loadYamlContent } from 'utils'

const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = {
    openapi: '3.0.0',
    info: loadYamlContent('info.yaml', 'info'),
    servers: loadYamlContent('servers.yaml', 'servers'),
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {},
    },
    paths: {},
  }

  const controllerYamlFiles = [
    'authentication',
    'user',
    'semesters',
    'learningActivities',
  ]

  controllerYamlFiles.forEach((file) => {
    const section = loadYamlContent(`controllers/${file}.yaml`)
    Object.assign(swaggerDocument.paths, section)
  })

  const schemaYamlFiles = ['User', 'Semester']

  schemaYamlFiles.forEach((file) => {
    const section = loadYamlContent(`schemas/${file}.yaml`)
    Object.assign(swaggerDocument.components.schemas, section)
  })

  return SwaggerUI.setup(swaggerDocument, options)
}

export default swaggerDocSetup
