import { newPasswordSchema, tokenSchema } from './fieldSchemas'

const changePasswordSchema = [...newPasswordSchema, ...tokenSchema]

export default changePasswordSchema
