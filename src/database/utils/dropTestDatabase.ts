import { coloredLogger } from '../../utils/coloredLogger'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

export const dropTestDatabase = async () => {
  try {
    const { TESTING_DATABASE_URI } = process.env

    await mongoose.disconnect()

    const db = await mongoose.connect(TESTING_DATABASE_URI!)

    if (db.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase()

      return true
    }
  } catch (error: any) {
    coloredLogger(error, 'error')
  }

  return false
}
