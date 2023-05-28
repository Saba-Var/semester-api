import { emailSchema, newPasswordSchema, usernameSchema } from './fieldSchemas'

let userSchema = [...newPasswordSchema, usernameSchema, emailSchema]

export default userSchema
