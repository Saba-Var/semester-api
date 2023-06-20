import { query } from 'express-validator'

const queryEmailSchema = query('email')
  .trim()
  .notEmpty()
  .withMessage('email_is_required')
  .isEmail()
  .withMessage('enter_valid_email')

export default queryEmailSchema
