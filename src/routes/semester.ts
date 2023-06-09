import { semesterValidationSchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  markSemesterAsCurrent,
  getSemesterData,
  createSemester,
  deleteSemester,
  getSemesters,
} from 'controllers'

const router = express.Router()

router.get('/', getSemesters)

router.get('/:id', idParamSchema, validateRequestSchema, getSemesterData)

router.post(
  '/',
  semesterValidationSchema,
  validateRequestSchema,
  createSemester
)

router.delete('/:id', idParamSchema, validateRequestSchema, deleteSemester)

router.put(
  '/:id/mark-as-current',
  idParamSchema,
  validateRequestSchema,
  markSemesterAsCurrent
)

export default router
