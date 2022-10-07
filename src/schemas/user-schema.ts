import { check } from 'express-validator'

const userSchema = [
  check('username')
    .trim()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage('Name should include at least 3 & max.15 characters'),

  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address'),

  check('password')
    .trim()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage('Name should include at least 3 & max.15 characters'),

  check('confirmPassword')
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Confirmation password doesn't match to new password")
      } else {
        return true
      }
    }),
]

export default userSchema
