import { newPasswordSchema, accessTokenSchema } from './common'

const changePasswordSchema = [...newPasswordSchema, accessTokenSchema]

export default changePasswordSchema
