import { param } from 'express-validator'
import { mongo } from 'mongoose'

const optionalParamId = [
  param('id')
    .optional()
    .custom((value) => {
      if (!mongo.ObjectId.isValid(value)) {
        throw new Error('User id is not valid')
      } else {
        return true
      }
    }),
]

export default optionalParamId
