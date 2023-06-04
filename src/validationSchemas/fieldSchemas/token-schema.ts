import { query } from 'express-validator'

const tokenSchema = query('token')
  .trim()
  .notEmpty()
  .withMessage('JWT is required')

export default tokenSchema
