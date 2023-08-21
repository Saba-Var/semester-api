import {
  newPasswordSchema,
  userImageSchema,
  usernameSchema,
  passwordSchema,
} from './common'

export const userUpdateSchema = [
  usernameSchema({ optional: true }),
  ...userImageSchema,
  ...newPasswordSchema({ optional: true }),
  passwordSchema({
    fieldName: 'oldPassword',
    minLength: 6,
    optional: true,
  }),
]
