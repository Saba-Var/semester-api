import { cookie } from 'express-validator'

const refreshTokenCookieSchema = cookie('refreshToken')
  .trim()
  .notEmpty()
  .withMessage('Refresh token is required!')

export default refreshTokenCookieSchema
