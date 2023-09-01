import { universitySchema } from './schemas'
import mongoose from 'mongoose'

const University = mongoose.model('university', universitySchema)

export default University
