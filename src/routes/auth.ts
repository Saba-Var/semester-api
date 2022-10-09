import { changePasswordSchema, googleUserSchema, userSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  passwordChangeRequestEmail,
  userAccountActivation,
  registerGoogleUser,
  changePassword,
  registerUser,
} from 'controllers'

const router = express.Router()

router.post('/sign-up', userSchema, validateRequestSchema, registerUser)

router.put('/activate-account', userAccountActivation)

router.get(
  '/change-password',
  validateRequestSchema,
  passwordChangeRequestEmail
)

router.put(
  '/change-password',
  changePasswordSchema,
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
