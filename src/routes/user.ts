import {
  getUserLearningActivities,
  createLearningActivity,
  getUserDetails,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails as any)

router.post('/learning-activities', createLearningActivity as any)

router.get('/learning-activities', getUserLearningActivities as any)

export default router
