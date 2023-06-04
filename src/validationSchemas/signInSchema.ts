import { emailSchema, passwordSchema } from './common'

const signInSchema = [emailSchema, passwordSchema()]

export default signInSchema
