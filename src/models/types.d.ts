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
  name: string
  user: Types.ObjectId
  learningActivities: Types.ObjectId[]
}
