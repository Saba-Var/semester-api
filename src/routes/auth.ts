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
  queryEmailSchema,
  signInSchema,
  tokenSchema,
  userSchema,
} from 'schemas'

const router = express.Router()

router.post('/sign-up', userSchema, validateRequestSchema, registerUser as any)

router.post(
  '/activate-account',
  tokenSchema,
  validateRequestSchema,
  userAccountActivation as any
)

router.post(
  '/sign-in',
  signInSchema,
  validateRequestSchema,
  authorization as any
)

router.get(
  '/change-password-request',
  queryEmailSchema,
  validateRequestSchema,
  passwordChangeRequestEmail as any
)

router.get('/refresh', validateRequestSchema, refresh as any)

router.get('/logout', refreshTokenCookieSchema, validateRequestSchema, logout)

router.put(
  '/change-password',
  changePasswordSchema,
  validateRequestSchema,
  changePassword as any
)

export default router
