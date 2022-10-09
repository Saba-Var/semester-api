import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  passwordChangeRequestEmail,
  userAccountActivation,
  registerGoogleUser,
  changePassword,
  registerUser,
} from 'controllers'
import {
  changePasswordReqSchema,
  googleUserSchema,
  emailSchema,
  userSchema,
} from 'schemas'

const router = express.Router()

router.post('/sign-up', userSchema, validateRequestSchema, registerUser)

router.put('/activate-account', userAccountActivation)

router.get(
  '/change-password',
  emailSchema,
  validateRequestSchema,
  passwordChangeRequestEmail
)

router.put(
  '/change-password',
  changePasswordReqSchema,
  validateRequestSchema,
  changePassword
)

router.post(
  '/google-sign-up',
  googleUserSchema,
  validateRequestSchema,
  registerGoogleUser
)

export default router
