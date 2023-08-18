import { newPasswordSchema, passwordSchema } from './common'

const changeLoggedUserPasswordSchema = [
  ...newPasswordSchema,
  passwordSchema(6, 'oldPassword'),
]

export default changeLoggedUserPasswordSchema
