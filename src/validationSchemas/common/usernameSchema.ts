import { check } from 'express-validator'

export const usernameSchema = check('username')
  .trim()
  .notEmpty()
  .withMessage('username_is_required')
  .isLength({
    min: 3,
    max: 30,
  })
  .withMessage('username_length')
