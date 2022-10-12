import { verifyToken, authLimiter } from 'middlewares'
import express, { RequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import { authRouter } from 'routes'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()

server.use(cors())
server.use(cors())
dotenv.config()

connectToMongo()

server.use(bodyParser.json())
server.use(cookieParser())

server.use('/authentication', authLimiter, authRouter)
server.use(verifyToken as RequestHandler)

server.listen(process.env.SERVER_PORT!, () => {
  console.log('Server started')
})
