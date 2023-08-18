import { check } from 'express-validator'

const newEmailSchema = check('newEmail')
  .trim()
  .notEmpty()
  .withMessage('email_is_required')
  .isEmail()
  .withMessage('enter_valid_email')

export default newEmailSchema
