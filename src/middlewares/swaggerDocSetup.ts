import SwaggerUI from 'swagger-ui-express'

export const swaggerDocSetup = () => {
  const options = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Semester API Specs',
  }

  const swaggerDocument = {}

  return SwaggerUI.setup(swaggerDocument, options)
}
