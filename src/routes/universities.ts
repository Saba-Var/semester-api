import { createUniversity, getUniversities } from 'controllers'
import { validateRequestSchema, isAdmin } from 'middlewares'
import { paginationSchema } from 'validationSchemas'
import express, { RequestHandler } from 'express'

const router = express.Router()

router.post('/', isAdmin, createUniversity)

router.get(
  '/',
  paginationSchema,
  validateRequestSchema,
  getUniversities as unknown as RequestHandler
)

export default router
