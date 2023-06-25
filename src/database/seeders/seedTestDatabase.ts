import mongoose from 'mongoose'
import { User } from 'models'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

export const seedTestDatabase = async () => {
  try {
    const {
      TESTING_USER_PASSWORD,
      TESTING_USER_USERNAME,
      TESTING_DATABASE_URI,
      TESTING_USER_EMAIL,
    } = process.env

    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect()
    }

    const db = await mongoose.connect(TESTING_DATABASE_URI!)

    if (db.connection.readyState === 1) {
      await mongoose.connection.db.dropDatabase()

      const testUser = {
        _id: '649821657afb954a0e7d4250',
        username: TESTING_USER_USERNAME,
        email: TESTING_USER_EMAIL,
        active: false,
        activeSemester: null,
        password: bcrypt.hashSync(TESTING_USER_PASSWORD!, 12),
        image: null,
        semesters: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const user = await User.create(testUser)

      await user.save()

      await mongoose.disconnect()

      return true
    }
  } catch (error) {
    console.error('Error seeding:', error)
  }

  return false
}
