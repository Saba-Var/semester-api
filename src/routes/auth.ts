import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  passwordChangeRequestEmail,
  userAccountActivation,
  changePassword,
  authorization,
  registerUser,
  refresh,
  logout,
} from 'controllers'
import {
  refreshTokenCookieSchema,
  changePasswordSchema,
  signInSchema,
  userSchema,
} from 'schemas'

const router = express.Router()

router.post('/sign-up', userSchema, validateRequestSchema, registerUser)

router.put('/activate-account', userAccountActivation)

router.post('/sign-in', signInSchema, validateRequestSchema, authorization)

router.get('/change-password-request', passwordChangeRequestEmail)

router.get('/refresh', refreshTokenCookieSchema, validateRequestSchema, refresh)

router.get('/logout', refreshTokenCookieSchema, validateRequestSchema, logout)

router.put(
  '/change-password',
  changePasswordSchema,
  validateRequestSchema,
  changePassword
)

export default router
