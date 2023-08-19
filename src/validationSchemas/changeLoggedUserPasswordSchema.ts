import { newPasswordSchema, passwordSchema } from './common'

export const changeLoggedUserPasswordSchema = [
  ...newPasswordSchema,
  passwordSchema(6, 'oldPassword'),
]
