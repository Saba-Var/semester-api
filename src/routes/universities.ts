import { validateRequestSchema, isAdmin } from 'middlewares'
import express, { RequestHandler } from 'express'
import {
  universityEvaluationValidation,
  paginationSchema,
  idParamSchema,
} from 'validation'
import {
  getUniversityData,
  createUniversity,
  getUniversities,
  rateUniversity,
} from 'controllers'

const router = express.Router()

router.post('/', isAdmin, createUniversity)

router.get(
  '/',
  paginationSchema,
  validateRequestSchema,
  getUniversities as unknown as RequestHandler
)

router.get('/:id', idParamSchema, validateRequestSchema, getUniversityData)

router.patch(
  '/:id/rate',
  idParamSchema,
  universityEvaluationValidation,
  validateRequestSchema,
  rateUniversity
)

export default router
