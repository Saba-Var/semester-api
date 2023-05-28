import passwordSchema from './passwordSchema'
import { check } from 'express-validator'

const newPasswordSchema = [
  passwordSchema(6),

  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirmation password doesn't match to new password")
    } else {
      return true
    }
  }),
]

export default newPasswordSchema
