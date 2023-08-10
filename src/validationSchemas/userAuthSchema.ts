import { emailSchema, newPasswordSchema, usernameSchema } from './common'

const userAuthSchema = [...newPasswordSchema, usernameSchema, emailSchema]

export default userAuthSchema
