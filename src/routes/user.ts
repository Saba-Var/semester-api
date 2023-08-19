import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  changeLoggedUserPasswordSchema,
  userUpdateSchema,
  newEmailSchema,
  tokenSchema,
} from 'validationSchemas'
import {
  changePasswordOfLoggedInUser,
  changeEmailRequest,
  updateUserDetails,
  activateNewEmail,
  getUserDetails,
} from 'controllers'

const router = express.Router()

router.get('/', getUserDetails)

router.put('/', userUpdateSchema, validateRequestSchema, updateUserDetails)

router.put(
  '/change-password',
  changeLoggedUserPasswordSchema,
  validateRequestSchema,
  changePasswordOfLoggedInUser
)

router.get(
  '/change-email',
  newEmailSchema,
  validateRequestSchema,
  changeEmailRequest
)

router.put(
  '/activate-email',
  tokenSchema,
  validateRequestSchema,
  activateNewEmail
)

export default router
