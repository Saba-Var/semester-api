import { param } from 'express-validator'
import { mongo } from 'mongoose'

export const idParamSchema = [
  param('id').custom((value) => {
    if (!mongo.ObjectId.isValid(value)) {
      throw new Error('invalid_id_param')
    } else {
      return true
    }
  }),
]

export default idParamSchema
