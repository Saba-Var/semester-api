import { cookie } from 'express-validator'

export const refreshTokenCookieSchema = cookie('refreshToken')
  .trim()
  .notEmpty()
  .withMessage('refreshToken_is_required')
