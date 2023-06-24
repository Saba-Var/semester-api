import { learningActivitySchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import {
  getAllLearningActivityOfSemester,
  createLearningActivity,
  deleteLearningActivity,
  updateLearningActivity,
  getLearningActivity,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/:id', idParamSchema, validateRequestSchema, getLearningActivity)

router.get(
  '/semesters/:id',
  idParamSchema,
  validateRequestSchema,
  getAllLearningActivityOfSemester
)

router.post(
  '/',
  learningActivitySchema,
  validateRequestSchema,
  createLearningActivity
)

router.put(
  '/:id',
  idParamSchema,
  learningActivitySchema,
  validateRequestSchema,
  updateLearningActivity
)

router.delete(
  '/:id',
  idParamSchema,
  validateRequestSchema,
  deleteLearningActivity
)

export default router
