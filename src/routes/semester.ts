import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  semesterValidationSchema,
  idParamSchema,
  endDateSchema,
} from 'validationSchemas'
import {
  getSemesterData,
  createSemester,
  deleteSemester,
  getSemesters,
  endSemester,
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
  '/:id/end',
  idParamSchema,
  endDateSchema,
  validateRequestSchema,
  endSemester
)

export default router
