import { cookie } from 'express-validator'

const refreshTokenCookieSchema = cookie('refreshToken')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('Refresh token is required!')

export default refreshTokenCookieSchema
