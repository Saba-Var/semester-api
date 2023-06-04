import type { Document, Types } from 'mongoose'
import { LearningActivityModel } from 'types'

export interface UserModel extends Document {
  learningActivities: LearningActivityModel[]
  password?: string
  username: string
  active: boolean
  image?: string
  email: string
}
