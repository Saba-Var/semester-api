import { check } from 'express-validator'

const usernameSchema = [
  check('username')
    .trim()
    .notEmpty()
    .isLength({
      min: 3,
      max: 15,
    })
    .withMessage('Name should include at least 3 & max.15 characters'),
]

export default usernameSchema
