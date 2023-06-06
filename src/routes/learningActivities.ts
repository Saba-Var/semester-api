import { learningActivitySchema, idParamSchema } from 'validationSchemas'
import { validateRequestSchema } from 'middlewares'
import {
  getUserLearningActivitiesBySemester,
  createLearningActivity,
  deleteLearningActivity,
  updateLearningActivity,
  getLearningActivity,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get(
  '/semesters/:id',
  idParamSchema,
  validateRequestSchema,
  getUserLearningActivitiesBySemester
)

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
  validateRequestSchema,
  deleteLearningActivity
)

export default router
