import { check } from 'express-validator'

const passwordSchema = (minLength = 1) =>
  check('password')
    .isLength({
      min: minLength,
    })
    .withMessage(
      minLength !== 1
        ? 'password_should_include_at_least_6_characters'
        : 'password_is_required'
    )

export default passwordSchema
