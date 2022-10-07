import { connectToMongo } from 'config'
import bodyParser from 'body-parser'
import { userRouter } from 'routes'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())
server.use(cors())
dotenv.config()

connectToMongo()
server.use(bodyParser.json())

server.use(userRouter)

server.listen(4444, () =>
  console.log('Server is listening at http://localhost:4444')
)
