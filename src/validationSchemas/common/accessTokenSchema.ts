import { query } from 'express-validator'

export const accessTokenSchema = query('accessToken')
  .trim()
  .notEmpty()
  .withMessage('jwt_is_required')
