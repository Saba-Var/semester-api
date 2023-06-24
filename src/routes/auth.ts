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
} from 'validationSchemas'

const router = express.Router()

router.post('/sign-up', userSchema, validateRequestSchema, registerUser)

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

router.get('/refresh', validateRequestSchema, refresh)

router.get('/logout', refreshTokenCookieSchema, validateRequestSchema, logout)

router.put(
  '/change-password',
  changePasswordSchema,
  validateRequestSchema,
  changePassword
)

export default router
