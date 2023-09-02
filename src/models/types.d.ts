import type { Document, Types } from 'mongoose'
import type {
  ILearningActivityModel,
  Timestamps,
  UserImage,
  UserRoles,
} from 'types'

export interface IUserModel extends Document {
  activeSemester: Types.ObjectId
  userUniversityInfo: {
    currentUniversity: Types.ObjectId
    selectedDate: Date
    ratedUniversities: Types.ObjectId[]
    allUniversities: Types.ObjectId[]
  } | null
  semesters: Types.ObjectId[]
  image?: UserImage | null
  password?: string
  username: string
  role: UserRoles
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

export interface IUniversityModel extends Document {
  name: {
    en: string
    ka: string
  }
  ratings: {
    users: Types.ObjectId[]
    criterias: {
      [key: string]: number
    }
  }
  averageRating: number
  voteCount: number
  logoSrc: string
  alias: string
  createdAt?: Date
  updatedAt?: Date
}
