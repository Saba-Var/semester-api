import type { Document, Types } from 'mongoose'
import { LearningActivityModel } from 'types'

export interface UserModel extends Document {
  semesters: Types.ObjectId[]
  password?: string
  username: string
  active: boolean
  image?: string
  email: string
}

export interface SemesterModel extends Document {
  learningActivities: Types.ObjectId[]
  isCurrentSemester: boolean
  user: Types.ObjectId
  startDate: Date
  name: string
}
