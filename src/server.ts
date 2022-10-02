import express, { Request, Response } from 'express'

const server = express()

server.get('/', async (_: Request, res: Response) => {
  res.status(200).json({})
})

server.listen(4444, () =>
  console.log('Server is listening at http://localhost:4444')
)
