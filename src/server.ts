import express, { Request, Response } from 'express'
import { connectToMongo } from 'config'
import dotenv from 'dotenv'
import cors from 'cors'

const server = express()
server.use(cors())
dotenv.config()

connectToMongo()

server.get('/', async (_: Request, res: Response) => {
  res.status(200).json({})
})

server.listen(4444, () =>
  console.log('Server is listening at http://localhost:4444')
)
