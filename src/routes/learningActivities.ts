import { learningActivitySchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import {
  getUserLearningActivities,
  createLearningActivity,
  deleteLearningActivity,
  updateLearningActivity,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserLearningActivities)

router.post(
  '/',
  learningActivitySchema,
  validateRequestSchema,
  createLearningActivity
)

router.put(
  '/:id',
  learningActivitySchema,
  validateRequestSchema,
  updateLearningActivity
)

router.delete('/:id', deleteLearningActivity)

export default router
