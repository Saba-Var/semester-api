import { semesterValidationSchema } from 'validationSchemas'
import { createSemester, getSemesters } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import express from 'express'

const router = express.Router()

router.get('/', getSemesters)

router.post(
  '/',
  semesterValidationSchema,
  validateRequestSchema,
  createSemester
)

export default router
