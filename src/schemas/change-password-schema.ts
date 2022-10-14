import { newPasswordSchema, accessTokenSchema } from './fieldSchemas'

const changePasswordSchema = [...newPasswordSchema, accessTokenSchema]

export default changePasswordSchema
