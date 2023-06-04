import type { Document, Types } from 'mongoose'
import { LearningActivity } from 'types'

export interface UserModel extends Document {
  learningActivities: LearningActivity[]
  password?: string
  username: string
  active: boolean
  image?: string
  email: string
}
