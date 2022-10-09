import { emailSchema, newPasswordSchema, usernameSchema } from './fieldSchemas'
import { ValidationChain } from 'express-validator'

let userSchema: ValidationChain | ValidationChain[] = [
  ...newPasswordSchema,
  ...usernameSchema,
  ...emailSchema,
]

export default userSchema
