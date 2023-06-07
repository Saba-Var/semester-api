import { createSemester, getSemesters, getSemesterData } from 'controllers'
import { semesterValidationSchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'

const router = express.Router()

router.get('/', getSemesters)

router.get('/:id', idParamSchema, validateRequestSchema, getSemesterData)

router.post(
  '/',
  semesterValidationSchema,
  validateRequestSchema,
  createSemester
)

export default router
