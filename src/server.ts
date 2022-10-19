import { verifyToken, authLimiter } from 'middlewares'
import express, { RequestHandler } from 'express'
import cookieParser from 'cookie-parser'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import { authRouter } from 'routes'
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

server.use('/authentication', authLimiter, authRouter)
server.use(verifyToken as RequestHandler)

server.get('/', (_, res) => {
  return res.status(200).json([1, 2, 3])
})

server.listen(process.env.SERVER_PORT!, () => {
  console.log('Server started')
})
