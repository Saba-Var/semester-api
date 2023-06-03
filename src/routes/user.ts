import {
  getUserLearningActivities,
  createLearningActivity,
  deleteLearningActivity,
  getUserDetails,
} from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails as any)

router.get('/learning-activities', getUserLearningActivities as any)

router.post('/learning-activities', createLearningActivity as any)

router.delete('/learning-activities/:id', deleteLearningActivity as any)

export default router
