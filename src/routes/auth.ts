import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  changePasswordOfLoggedInUser,
  passwordChangeRequestEmail,
  userAccountActivation,
  changeEmailRequest,
  changePassword,
  authorization,
  registerUser,
  refresh,
  logout,
} from 'controllers'
import {
  refreshTokenCookieSchema,
  changePasswordSchema,
  refreshTokenSchema,
  queryEmailSchema,
  userAuthSchema,
  newEmailSchema,
  signInSchema,
  tokenSchema,
} from 'validationSchemas'

const router = express.Router()

router.post('/sign-up', userAuthSchema, validateRequestSchema, registerUser)

router.post(
  '/activate-account',
  tokenSchema,
  validateRequestSchema,
  userAccountActivation
)

router.post('/sign-in', signInSchema, validateRequestSchema, authorization)

router.get(
  '/change-password',
  queryEmailSchema,
  validateRequestSchema,
  passwordChangeRequestEmail
)

router.get('/refresh', refreshTokenSchema, validateRequestSchema, refresh)

router.get('/logout', refreshTokenCookieSchema, validateRequestSchema, logout)

router.put(
  '/change-password',
  changePasswordSchema,
  validateRequestSchema,
  changePassword
)

export default router
