import { check } from 'express-validator'
import { mongo } from 'mongoose'

export const imageSchema = check('imageSchema').custom((value) => {
  if (!mongo.ObjectId.isValid(value)) {
    throw new Error('invalid_id_param')
  } else {
    return true
  }
})
