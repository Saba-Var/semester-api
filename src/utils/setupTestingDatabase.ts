import supertest from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import server from 'server'

dotenv.config()

export const setupTestingDatabase = ({
  databaseUri = process.env.TESTING_DATABASE_URI!,
} = {}) => {
  const request = supertest(server)

  beforeAll(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }
    await mongoose.connect(databaseUri)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  return { ...request }
}
