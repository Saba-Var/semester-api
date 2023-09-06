import { emailSchema, passwordSchema } from './common'

export const signInSchema = [emailSchema, passwordSchema()]
