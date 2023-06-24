import middleware from 'i18next-http-middleware'
import Backend from 'i18next-fs-backend'
import i18next from 'i18next'
import path from 'path'

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'en',
    backend: {
      loadPath: path.join(__dirname, '../locales/{{lng}}/{{ns}}.json'),
    },
    preload: ['en', 'ka'],
  })

export const i18nextMiddleware = middleware.handle(i18next)
