import type { ILearningActivityModel, UserImage } from 'types'
import type { Document, Types } from 'mongoose'

export interface IUserModel extends Document {
  activeSemester: Types.ObjectId
  semesters: Types.ObjectId[]
  image?: UserImage | null
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
