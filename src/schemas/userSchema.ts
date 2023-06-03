import { emailSchema, newPasswordSchema, usernameSchema } from './fieldSchemas'

const userSchema = [...newPasswordSchema, usernameSchema, emailSchema]

export default userSchema
