import { usernameSchema, userImageSchema } from './common'

export const userUpdateSchema = [usernameSchema, ...userImageSchema]
