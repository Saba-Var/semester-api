import { query } from 'express-validator'

const queryEmailSchema = query('email')
  .exists()
  .trim()
  .isEmail()
  .withMessage('Enter valid email address!')

export default queryEmailSchema
