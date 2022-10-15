import { check } from 'express-validator'

const usernameSchema = check('username')
  .exists()
  .trim()
  .notEmpty()
  .isLength({
    min: 3,
    max: 20,
  })
  .withMessage('Name should include at least 3 & max.20 characters')

export default usernameSchema
