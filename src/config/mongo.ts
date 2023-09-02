import mongoose from 'mongoose'
import { coloredLogger } from 'bin'
import dotenv from 'dotenv'

dotenv.config()

const generateLocalMongoURL = () => {
  const { MONGO_PROTOCOL, MONGO_HOST, MONGO_PORT, MONGO_DATABASE } = process.env

  return `${MONGO_PROTOCOL}://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`
}

const generateAtlasMongoURL = () => {
  const {
    MONGO_PASSWORD,
    MONGO_PROTOCOL,
    MONGO_DATABASE,
    MONGO_USER,
    MONGO_HOST,
  } = process.env

  return `${MONGO_PROTOCOL}://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}/${MONGO_DATABASE}`
}

const shouldConnectToLocalDatabase = () =>
  process.env.MONGO_PROTOCOL === 'mongodb'

const connectToMongo = async () => {
  try {
    const connectionURL = shouldConnectToLocalDatabase()
      ? generateLocalMongoURL()
      : generateAtlasMongoURL()

    coloredLogger(`Connected to mongoDb successfully!`, 'success')
    return mongoose.connect(connectionURL)
  } catch (error: any) {
    coloredLogger(`Mongo connection error: ${error.message}`, 'error')
    throw new Error(error.message)
  }
}

export default connectToMongo
