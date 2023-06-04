import { learningActivitySchema } from './schemas'
import mongoose from 'mongoose'

const LearningActivity = mongoose.model(
  'learningActivity',
  learningActivitySchema
)

export default LearningActivity
