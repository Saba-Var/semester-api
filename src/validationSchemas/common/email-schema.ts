import { check } from 'express-validator'

const emailSchema = check('email')
  .trim()
  .notEmpty()
  .withMessage('email_is_required')
  .isEmail()
  .withMessage('enter_valid_email')

export default emailSchema
