import type { UserImage, UserRoles } from 'types'
import type { Document, Types } from 'mongoose'

export interface IUserModel extends Document {
  activeSemester: Types.ObjectId
  userUniversityInfo: {
    currentUniversity: {
      universityId: Types.ObjectId | null
      selectedDate: Date | null
    }
    ratedUniversities: {
      university: Types.ObjectId
      rateDate: Date
    }[]
    allUniversities: {
      university: Types.ObjectId
      selectedDate: Date
    }[]
    selectedDate: Date | null
  }
  semesters: Types.ObjectId[]
  image?: UserImage | null
  password?: string
  username: string
  lastActive: Date
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

export type IUniversitiesBaseData = {
  name: {
    en: string
    ka: string
  }
  alias: string
  code: string
  website: string
}

export interface IUniversityModel extends Document, IUniversitiesBaseData {
  evaluation: {
    users: Types.ObjectId[]
    voteCount: number
    criterias: {
      [key: string]: {
        averageScore: number | null
        totalScore: number
      }
    }
  }
  averageRating: number
  totalScore: number
  logoSrc: string
  createdAt?: Date
  updatedAt?: Date
}
