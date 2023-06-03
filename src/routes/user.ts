import { getUserDetails, createLearningActivity } from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails as any)

router.post('/learning-activity', createLearningActivity as any)

export default router
