import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const setupTestingDatabase = () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DATABASE_URI!)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })
}
