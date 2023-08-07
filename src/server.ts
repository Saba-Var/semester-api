import express, { type RequestHandler } from 'express'
import SwaggerUI from 'swagger-ui-express'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import {
  i18nextMiddleware,
  swaggerDocSetup,
  errorHandler,
  verifyToken,
  authLimiter,
} from 'middlewares'
import {
  learningActivitiesRouter,
  semesterRouter,
  authRouter,
  userRouter,
} from 'routes'

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

server.use('/api-docs', SwaggerUI.serve, swaggerDocSetup())

server.use('/api/authentication', authLimiter, authRouter)

server.use(verifyToken as unknown as RequestHandler)

server.use('/api/learning-activities', learningActivitiesRouter)
server.use('/api/semesters', semesterRouter)
server.use('/api/user', userRouter)

server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))

server.use(errorHandler)

const port = process.env.SERVER_PORT || 4000
server.listen(port, async () => {
  await connectToMongo()
  console.log(`Server started on port ${port}`)
})

export default server
