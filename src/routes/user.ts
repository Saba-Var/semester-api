import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  userUpdateSchema,
  newEmailSchema,
  tokenSchema,
} from 'validationSchemas'
import {
  changeEmailRequest,
  updateUserDetails,
  activateNewEmail,
  getUserDetails,
} from 'controllers'

const router = express.Router()

router.get('/', getUserDetails)

router.put('/', userUpdateSchema, validateRequestSchema, updateUserDetails)

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
