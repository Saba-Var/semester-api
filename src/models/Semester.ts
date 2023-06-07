import { semesterSchema } from './schemas'
import mongoose from 'mongoose'

const Semester = mongoose.model('semester', semesterSchema)

export default Semester
