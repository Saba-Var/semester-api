import type { ILearningActivityModel, UserImage, Timestamps } from 'types'
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

interface IUniversityModel extends Document {
  name: string
  ratings: Types.ObjectId[]
  image?: string
  averageRatings?: {
    [key: string]: number
  }
  overallRating: null
  createdAt?: Date
  updatedAt?: Date
}

export interface IUniversityRatingModel extends Document {
  university: Types.ObjectId
  user: Types.ObjectId
  scores: {
    [key: string]: number
  }
  createdAt?: Date
  updatedAt?: Date
}
