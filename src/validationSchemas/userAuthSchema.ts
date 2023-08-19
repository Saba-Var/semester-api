import { emailSchema, newPasswordSchema, usernameSchema } from './common'

export const userAuthSchema = [
  ...newPasswordSchema,
  usernameSchema(),
  emailSchema,
]
