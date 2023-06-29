import { cookie } from 'express-validator'

export const refreshTokenSchema = cookie('refreshToken')
  .trim()
  .notEmpty()
  .withMessage('refresh_token_is_required')
