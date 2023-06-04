import { newLearningActivitySchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import {
  getUserLearningActivities,
  createLearningActivity,
  deleteLearningActivity,
  getUserDetails,
  updateLearningActivity,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails)

router.get('/learning-activities', getUserLearningActivities)

router.post(
  '/learning-activities',
  newLearningActivitySchema,
  validateRequestSchema,
  createLearningActivity
)

router.put('/learning-activities/:id', updateLearningActivity)

router.delete('/learning-activities/:id', deleteLearningActivity)

export default router
