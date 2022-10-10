import { emailSchema, passwordSchema } from './fieldSchemas'

const signInSchema = [...emailSchema, passwordSchema]

export default signInSchema
