import { newPasswordSchema, accessTokenSchema } from './common'

export const changePasswordSchema = [...newPasswordSchema, accessTokenSchema]
