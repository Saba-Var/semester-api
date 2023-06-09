import { check } from 'express-validator'

const emailSchema = check('email')
  .trim()
  .notEmpty()
  .withMessage("'email' is required!")
  .isEmail()
  .withMessage('Enter valid email address!')

export default emailSchema
