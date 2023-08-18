import { validateRequestSchema } from 'middlewares'
import { newEmailSchema } from 'validationSchemas'
import express from 'express'
import {
  changePasswordOfLoggedInUser,
  changeEmailRequest,
  updateUserDetails,
  getUserDetails,
} from 'controllers'

const router = express.Router()

router.get('/', getUserDetails)

router.put('/', updateUserDetails)

router.put('/change-password', changePasswordOfLoggedInUser)

router.get(
  '/change-email',
  newEmailSchema,
  validateRequestSchema,
  changeEmailRequest
)

export default router
