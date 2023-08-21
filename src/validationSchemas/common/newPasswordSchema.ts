import { passwordSchema } from './passwordSchema'
import { check } from 'express-validator'

export const newPasswordSchema = ({ optional = false } = {}) => [
  passwordSchema({
    minLength: 6,
    optional,
  }),

  check('confirmPassword').custom((value, { req }) => {
    if (req.body.password && !value) {
      throw new Error('password_confirmation_is_required')
    } else if (value !== req.body.password) {
      throw new Error('confirm_password_does_not_match')
    } else {
      return true
    }
  }),
]
