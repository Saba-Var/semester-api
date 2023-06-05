import { semesterValidationSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import { createSemester } from 'controllers'
import express from 'express'

const router = express.Router()

router.post(
  '/',
  semesterValidationSchema,
  validateRequestSchema,
  createSemester
)

export default router
