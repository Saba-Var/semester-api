import { connectToMongo } from 'config'
import mongoose from 'mongoose'

jest.mock('mongoose')

describe('connectToMongo', () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should connect to local database when MONGO_PROTOCOL is "mongodb"', async () => {
    process.env.MONGO_PROTOCOL = 'mongodb'
    process.env.MONGO_HOST = 'localhost'
    process.env.MONGO_PORT = '27017'
    process.env.MONGO_DATABASE = 'test'

    await connectToMongo()

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb://localhost:27017/test'
    )
  })

  it('should connect to Atlas database when MONGO_PROTOCOL is not "mongodb"', async () => {
    process.env.MONGO_PROTOCOL = 'mongodb+srv'
    process.env.MONGO_USER = 'testuser'
    process.env.MONGO_PASSWORD = 'testpassword'
    process.env.MONGO_HOST = 'testcluster.mongodb.net'
    process.env.MONGO_DATABASE = 'test'

    await connectToMongo()

    expect(mongoose.connect).toHaveBeenCalledWith(
      'mongodb+srv://testuser:testpassword@testcluster.mongodb.net/test'
    )
  })

  it('should throw an error if connection fails', async () => {
    process.env.MONGO_PROTOCOL = 'mongodb'
    process.env.MONGO_HOST = 'localhost'
    process.env.MONGO_PORT = '27017'
    process.env.MONGO_DATABASE = 'test'

    const errorMessage = 'Connection failed'

    ;(mongoose.connect as jest.Mock).mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    )

    await expect(connectToMongo()).rejects.toThrow(errorMessage)
  })
})
