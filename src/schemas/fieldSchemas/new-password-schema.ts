import { check } from 'express-validator'

const newPasswordSchema = [
  check('password')
    .isLength({
      min: 6,
    })
    .withMessage('Password should include at least 6 characters'),

  check('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Confirmation password doesn't match to new password")
    } else {
      return true
    }
  }),
]

export default newPasswordSchema
