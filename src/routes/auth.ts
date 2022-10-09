import { userSchema, googleUserSchema } from 'schemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  userAccountActivation,
  registerGoogleUser,
  registerUser,
} from 'controllers'

const router = express.Router()

router.post('/user', userSchema, validateRequestSchema, registerUser)

router.put('/account', userAccountActivation)

router.post(
  '/google-user',
  googleUserSchema,
  validateRequestSchema,
  registerGoogleUser
)

export default router
