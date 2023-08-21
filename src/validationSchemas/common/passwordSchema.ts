import { check } from 'express-validator'

export const passwordSchema = ({
  fieldName = 'password',
  minLength = 1,
  optional = false,
} = {}) =>
  check(fieldName)
    .optional(optional)
    .isLength({
      min: minLength,
    })
    .withMessage(
      minLength !== 1
        ? 'password_should_include_at_least_6_characters'
        : 'password_is_required'
    )
