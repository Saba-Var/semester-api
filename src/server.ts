import express, { type RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'
import {
  learningActivitiesRouter,
  semesterRouter,
  authRouter,
  userRouter,
} from 'routes'
import {
  i18nextMiddleware,
  swaggerDocSetup,
  errorHandler,
  verifyToken,
  authLimiter,
} from 'middlewares'

const server = express()

dotenv.config()

server.use(i18nextMiddleware)
server.use(bodyParser.json())
server.use(cookieParser())

server.use(
  cors({
    origin: process.env.FRONTEND_URI!,
    credentials: true,
  })
)

connectToMongo()

server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))

server.use(authLimiter)

server.use('/api-docs', SwaggerUI.serve, swaggerDocSetup())

server.use('/api/authentication', authRouter)

server.use(verifyToken as unknown as RequestHandler)

server.use('/api/learning-activities', learningActivitiesRouter)
server.use('/api/semesters', semesterRouter)
server.use('/api/user', userRouter)

server.use(errorHandler)

server.listen(process.env.SERVER_PORT!, () => {
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${process.env.SERVER_PORT}`)
})
