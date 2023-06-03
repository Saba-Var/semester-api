import { check } from 'express-validator'

const usernameSchema = check('username')
  .exists()
  .trim()
  .notEmpty()
  .isLength({
    min: 3,
    max: 30,
  })
  .withMessage('Name should include at least 3 & max.30 characters')

export default usernameSchema
