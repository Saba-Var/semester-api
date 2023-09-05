import { paginationSchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema, isAdmin } from 'middlewares'
import express, { RequestHandler } from 'express'
import {
  getUniversityData,
  createUniversity,
  getUniversities,
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

export default router
