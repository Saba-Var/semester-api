import mongoose from 'mongoose'

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
    let connectionURL = shouldConnectToLocalDatabase()
      ? generateLocalMongoURL()
      : generateAtlasMongoURL()

    if (process.env.NODE_ENV === 'testing') {
      connectionURL = process.env.TESTING_DATABASE_URI!
    }

    return mongoose.connect(connectionURL)
  } catch (error: any) {
    console.log(`Mongo connection error: ${error.message}`)
    throw new Error(error.message)
  }
}

export default connectToMongo
