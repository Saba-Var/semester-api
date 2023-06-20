import { query } from 'express-validator'

const tokenSchema = query('token')
  .trim()
  .notEmpty()
  .withMessage('jwt_is_required')

export default tokenSchema
