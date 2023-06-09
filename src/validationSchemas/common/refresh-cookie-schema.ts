import { cookie } from 'express-validator'

const refreshTokenCookieSchema = cookie('refreshToken')
  .trim()
  .notEmpty()
  .withMessage("'refreshToken' is required!")

export default refreshTokenCookieSchema
