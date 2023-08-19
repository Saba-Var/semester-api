import { passwordSchema } from './passwordSchema'
import { check } from 'express-validator'

export const newPasswordSchema = [
  passwordSchema(6),

  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('confirm_password_does_not_match')
    } else {
      return true
    }
  }),
]
