import { query } from 'express-validator'

export const newEmailSchema = query('newEmail')
  .trim()
  .notEmpty()
  .withMessage('email_is_required')
  .isEmail()
  .withMessage('enter_valid_email')
