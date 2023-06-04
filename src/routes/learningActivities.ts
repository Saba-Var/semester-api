import { learningActivitySchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import {
  getUserLearningActivities,
  createLearningActivity,
  deleteLearningActivity,
  updateLearningActivity,
  getLearningActivity,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserLearningActivities)

router.get('/:id', idParamSchema, validateRequestSchema, getLearningActivity)

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
  learningActivitySchema,
  deleteLearningActivity
)

export default router
