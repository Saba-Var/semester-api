import type { Document, Types } from 'mongoose'
import { LearningActivityModel } from 'types'

export interface UserModel extends Document {
  activeSemester: Types.ObjectId
  semesters: Types.ObjectId[]
  image?: string | null
  password?: string
  username: string
  active: boolean
  email: string
}

export interface SemesterModel extends Document {
  learningActivities: Types.ObjectId[]
  isCurrentSemester: boolean
  user: Types.ObjectId
  startDate: Date
  endDate: Date
  name: string
}
