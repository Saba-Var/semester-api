import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  changeLoggedUserPasswordSchema,
  newEmailSchema,
} from 'validationSchemas'
import {
  changePasswordOfLoggedInUser,
  changeEmailRequest,
  updateUserDetails,
  getUserDetails,
} from 'controllers'

const router = express.Router()

router.get('/', getUserDetails)

router.put('/', updateUserDetails)

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

export default router
