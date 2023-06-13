import { validateRequestSchema } from 'middlewares'
import express from 'express'
import {
  getSemesterData,
  createSemester,
  deleteSemester,
  updateSemester,
  getSemesters,
  endSemester,
} from 'controllers'
import {
  semesterValidationSchema,
  idParamSchema,
  endDateSchema,
} from 'validationSchemas'

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
  '/:id',
  idParamSchema,
  semesterValidationSchema,
  validateRequestSchema,
  updateSemester
)

router.put(
  '/:id/end',
  idParamSchema,
  endDateSchema,
  validateRequestSchema,
  endSemester
)

export default router
