import { verifyToken, authLimiter } from 'middlewares'
import express, { RequestHandler } from 'express'
import { authRouter, userRouter } from 'routes'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()

server.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
dotenv.config()

connectToMongo()

server.use(bodyParser.json())
server.use(cookieParser())

server.use(authLimiter)

server.use('/authentication', authRouter)
server.use(verifyToken as unknown as RequestHandler)
server.use('/user', userRouter)

server.listen(process.env.SERVER_PORT!, () => {
  console.log('Server started')
})
