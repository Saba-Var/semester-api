import { mongo } from 'mongoose'

export const validateMongoDbId = (value: any) => {
  if (!mongo.ObjectId.isValid(value)) {
    throw new Error('invalid_mongoDB_id')
  } else {
    return true
  }
}
