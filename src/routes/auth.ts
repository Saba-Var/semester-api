import { validateRequestSchema } from 'middlewares'
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

router.post('/sign-up', userSchema, validateRequestSchema, registerUser)

router.put('/activate-account', userAccountActivation)

router.put('/sign-in', signInSchema, validateRequestSchema, authorization)

router.get('/change-password-request', passwordChangeRequestEmail)

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
