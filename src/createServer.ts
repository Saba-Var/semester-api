import express, { type RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
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
  verifyToken,
  authLimiter,
} from 'middlewares'

export const createServer = () => {
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

  server.use(authLimiter)

  server.use('/api-docs', SwaggerUI.serve, swaggerDocSetup())

  server.use('/api/authentication', authRouter)

  server.use(verifyToken as unknown as RequestHandler)

  server.use('/api/learning-activities', learningActivitiesRouter)
  server.use('/api/semesters', semesterRouter)
  server.use('/api/user', userRouter)

  return server
}
