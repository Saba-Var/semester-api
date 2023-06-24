import { createServer } from './createServer'
import { errorHandler } from 'middlewares'
import { connectToMongo } from 'config'
import path from 'path'

const server = createServer()

server.set('view engine', 'pug')
server.set('views', path.join(__dirname, 'views'))

server.use(errorHandler)

const port = process.env.SERVER_PORT || 4000
server.listen(port, async () => {
  await connectToMongo()
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`)
})
