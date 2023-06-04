import { param } from 'express-validator'
import { mongo } from 'mongoose'

const idParamSchema = [
  param('id').custom((value) => {
    if (!mongo.ObjectId.isValid(value)) {
      throw new Error('Invalid id param. Provide a valid mongoDB id.')
    } else {
      return true
    }
  }),
]

export default idParamSchema
