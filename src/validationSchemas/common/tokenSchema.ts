import { query } from 'express-validator'

export const tokenSchema = query('token')
  .trim()
  .notEmpty()
  .withMessage('jwt_is_required')
