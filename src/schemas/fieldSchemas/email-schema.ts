import { check } from 'express-validator'

const emailSchema = [
  check('email')
    .exists()
    .trim()
    .isEmail()
    .withMessage('Enter valid email address!'),
]

export default emailSchema
