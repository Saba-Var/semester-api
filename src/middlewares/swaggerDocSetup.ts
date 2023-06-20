import SwaggerUI from 'swagger-ui-express'
import YAML from 'yamljs'

const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = YAML.load('./src/docs/swagger.yaml')
  return SwaggerUI.setup(swaggerDocument, options)
}

export default swaggerDocSetup
