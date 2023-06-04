import { query } from 'express-validator'

const queryEmailSchema = query('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required!')
  .isEmail()
  .withMessage('Enter valid email address!')

export default queryEmailSchema
