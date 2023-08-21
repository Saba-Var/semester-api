import { newPasswordSchema, passwordSchema } from './common'

export const changeLoggedUserPasswordSchema = [
  ...newPasswordSchema(),
  passwordSchema({
    fieldName: 'oldPassword',
    minLength: 6,
  }),
]
