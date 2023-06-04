import { check } from 'express-validator'

const emailSchema = check('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required!')
  .isEmail()
  .withMessage('Enter valid email address!')

export default emailSchema
