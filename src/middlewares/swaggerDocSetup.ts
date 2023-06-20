import SwaggerUI from 'swagger-ui-express'
import { loadYamlContent } from 'utils'

const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = {
    openapi: '3.0.0',
    info: loadYamlContent('info/info.yaml', 'info'),
    servers: loadYamlContent('servers/servers.yaml', 'servers'),
    components: loadYamlContent('components/components.yaml', 'components'),
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

  return SwaggerUI.setup(swaggerDocument, options)
}

export default swaggerDocSetup
