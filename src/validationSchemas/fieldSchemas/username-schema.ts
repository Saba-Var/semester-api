import { check } from 'express-validator'

const usernameSchema = check('username')
  .trim()
  .notEmpty()
  .withMessage('Username is required')
  .isLength({
    min: 3,
    max: 30,
  })
  .withMessage('Username should include at least 3 & max.30 characters')

export default usernameSchema
