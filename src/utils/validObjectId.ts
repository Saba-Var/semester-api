import mongoose from 'mongoose'

const validObjectId = (id: string) => {
  return mongoose.isValidObjectId(id)
}

export default validObjectId
