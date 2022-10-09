import { newPasswordSchema, tokenSchema } from './fieldSchemas'

const changePasswordReqSchema = [...newPasswordSchema, ...tokenSchema]

export default changePasswordReqSchema
