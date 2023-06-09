import { check } from 'express-validator'

const usernameSchema = check('username')
  .trim()
  .notEmpty()
  .withMessage("'username' is required!")
  .isLength({
    min: 3,
    max: 30,
  })
  .withMessage("'username' should be between 3 and 30 characters!")

export default usernameSchema
