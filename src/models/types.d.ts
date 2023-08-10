import type { Document, Types } from 'mongoose'
import { LearningActivityModel } from 'types'

export interface IUserModel extends Document {
  activeSemester: Types.ObjectId
  semesters: Types.ObjectId[]
  password?: string
  username: string
  active: boolean
  email: string
  image?: {
    url: string
    type: 'dicebear' | 'upload'
  } | null
}

export interface SemesterModel extends Document {
  learningActivities: Types.ObjectId[]
  isCurrentSemester: boolean
  user: Types.ObjectId
  startDate: Date
  endDate: Date
  name: string
}
