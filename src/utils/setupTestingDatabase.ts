import { createServer } from 'createServer'
import supertest from 'supertest'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const setupTestingDatabase = () => {
  const request = supertest(createServer())

  beforeAll(async () => {
    await mongoose.connect(process.env.TESTING_DATABASE_URI!)
  })

  afterAll(async () => {
    await mongoose.connection.close()
  })

  return { request }
}
