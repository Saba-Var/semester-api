import { authenticateToken } from 'middlewares'
import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import { authRouter } from 'routes'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())
server.use(cors())
dotenv.config()

connectToMongo()
server.use(bodyParser.json())

server.use(authenticateToken)
server.use('/authentication', authRouter)

server.listen(process.env.SERVER_PORT!, () => console.log('Server started'))
