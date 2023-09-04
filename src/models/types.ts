import type { UserImage, UserRoles } from 'types'
import type { Document, Types } from 'mongoose'

export interface IUserModel extends Document {
  activeSemester: Types.ObjectId
  userUniversityInfo: {
    currentUniversity: Types.ObjectId | null
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
  ratings: {
    users: Types.ObjectId[]
    criterias: {
      [key: string]: number
    }
  }
  averageRating: number
  voteCount: number
  logoSrc: string
  createdAt?: Date
  updatedAt?: Date
}
