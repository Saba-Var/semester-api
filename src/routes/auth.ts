import { validateRequestSchema } from 'middlewares'
import { rateLimiter } from 'middlewares'
import express from 'express'
import {
  passwordChangeRequestEmail,
  userAccountActivation,
  registerGoogleUser,
  changePassword,
  authorization,
  registerUser,
} from 'controllers'
import {
  changePasswordSchema,
  googleUserSchema,
  signInSchema,
  userSchema,
} from 'schemas'

const router = express.Router()

router.post(
  '/sign-up',
  rateLimiter,
  userSchema,
  validateRequestSchema,
  registerUser
)

router.put('/activate-account', rateLimiter, userAccountActivation)

router.post(
  '/sign-in',
  rateLimiter,
  signInSchema,
  validateRequestSchema,
  authorization
)

router.get('/change-password-request', passwordChangeRequestEmail)

router.put(
  '/change-password',
  rateLimiter,
  changePasswordSchema,
  validateRequestSchema,
  changePassword
)

router.post(
  '/google-sign-up',
  rateLimiter,
  googleUserSchema,
  validateRequestSchema,
  registerGoogleUser
)

export default router
