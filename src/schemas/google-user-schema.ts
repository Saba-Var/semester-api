import { usernameSchema, emailSchema } from './fieldSchemas'

const googleUserSchema = [...usernameSchema, ...emailSchema]

export default googleUserSchema
