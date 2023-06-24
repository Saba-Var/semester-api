import { verifyToken, authLimiter, swaggerDocSetup } from 'middlewares'
import express, { type RequestHandler } from 'express'
import middleware from 'i18next-http-middleware'
import SwaggerUI from 'swagger-ui-express'
import Backend from 'i18next-fs-backend'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import i18next from 'i18next'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import {
  learningActivitiesRouter,
  semesterRouter,
  authRouter,
  userRouter,
} from 'routes'

i18next
  .use(Backend)
  .use(middleware.LanguageDetector)
  .init({
    fallbackLng: 'ka',
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/{{ns}}.json'),
    },
    preload: ['ka', 'en'],
  })

const server = express()

server.use(middleware.handle(i18next))

dotenv.config()

server.use(
  cors({
    origin: process.env.FRONTEND_URI!,
    credentials: true,
  })
)

connectToMongo()

server.use(bodyParser.json())
server.use('/api-docs', SwaggerUI.serve, swaggerDocSetup())
server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))
server.use(cookieParser())

server.use(authLimiter)

server.use('api/authentication', authRouter)
server.use(verifyToken as unknown as RequestHandler)
server.use('api/user', userRouter)
server.use('api/learning-activities', learningActivitiesRouter)
server.use('api/semesters', semesterRouter)

server.listen(process.env.SERVER_PORT!, () => {
  // eslint-disable-next-line no-console
  console.log('Server started')
})
