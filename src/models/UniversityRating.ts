import { universityRatingSchema } from './schemas'
import mongoose from 'mongoose'

const UniversityRating = mongoose.model(
  'universityRating',
  universityRatingSchema
)

export default UniversityRating
