import { emailSchema, newPasswordSchema, usernameSchema } from './common'

const userSchema = [...newPasswordSchema, usernameSchema, emailSchema]

export default userSchema
