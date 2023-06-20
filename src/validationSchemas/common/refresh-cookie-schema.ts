import { cookie } from 'express-validator'

const refreshTokenCookieSchema = cookie('refreshToken')
  .trim()
  .notEmpty()
  .withMessage('refreshToken_is_required')

export default refreshTokenCookieSchema
