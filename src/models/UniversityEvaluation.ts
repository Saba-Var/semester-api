import { universityEvaluationSchema } from './schemas'
import mongoose from 'mongoose'

const UniversityEvaluation = mongoose.model(
  'universityEvaluation',
  universityEvaluationSchema
)

export default UniversityEvaluation
