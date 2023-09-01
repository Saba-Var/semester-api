import mongoose from 'mongoose'
import { logger } from 'bin'
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

    logger(`Connected to mongoDb successfully!`, 'success')
    return mongoose.connect(connectionURL)
  } catch (error: any) {
    logger(`Mongo connection error: ${error.message}`, 'error')
    throw new Error(error.message)
  }
}

export default connectToMongo
