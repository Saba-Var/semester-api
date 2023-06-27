import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const dropTestDatabase = async () => {
  try {
    const { TESTING_DATABASE_URI } = process.env

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    const db = await mongoose.connect(TESTING_DATABASE_URI!)

    if (db.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase()

      await mongoose.disconnect()

      return true
    }
  } catch (error) {
    console.error('Error seeding:', error)
  }

  return false
}
