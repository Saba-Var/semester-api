import { verifyToken, authLimiter } from 'middlewares'
import express, { type RequestHandler } from 'express'
import { authRouter, userRouter } from 'routes'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import path from 'path'
import cors from 'cors'

const server = express()
dotenv.config()

server.use(
  cors({
    origin: process.env.FRONTEND_URI!,
    credentials: true,
  })
)

connectToMongo()

server.use(bodyParser.json())
server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))
server.use(cookieParser())

server.use(authLimiter)

server.use('/authentication', authRouter)
server.use(verifyToken as unknown as RequestHandler)
server.use('/user', userRouter)

server.listen(process.env.SERVER_PORT!, () => {
  console.log('Server started')
})
