import { check } from 'express-validator'

const googleUserSchema = [
  check('username')
    .trim()
    .notEmpty()
    .withMessage('Name should include at least 3 & max.15 characters'),

  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address'),
]

export default googleUserSchema
