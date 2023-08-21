import { userImageSchema, usernameSchema } from './common'
import { check } from 'express-validator'

const isPasswordChangeMode = (value: string | undefined, req: any) =>
  !value?.length &&
  (typeof req.body.newPassword === 'string' ||
    typeof req.body.oldPassword === 'string')

export const userUpdateSchema = [
  usernameSchema({ optional: true }),
  ...userImageSchema,

  check('newPassword').custom((value, { req }) => {
    if (isPasswordChangeMode(value, req)) {
      throw new Error('new_password_is_required')
    }

    if (value?.length < 6) {
      throw new Error('password_should_include_at_least_6_characters')
    }

    if (value && !/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(value)) {
      throw new Error('new_password_requirements')
    }

    return true
  }),

  check('oldPassword').custom((value, { req }) => {
    if (isPasswordChangeMode(value, req)) {
      throw new Error('current_password_is_required')
    }
    return true
  }),

  check('confirmPassword').custom((value, { req }) => {
    if (isPasswordChangeMode(value, req)) {
      throw new Error('password_confirmation_is_required')
    } else if (value !== req.body.newPassword) {
      throw new Error('confirm_password_does_not_match')
    } else {
      return true
    }
  }),
]
