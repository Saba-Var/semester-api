import { learningActivitySchema } from 'validationSchemas'
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

router.get('/:id', getLearningActivity)

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
