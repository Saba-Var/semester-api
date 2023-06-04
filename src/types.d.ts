import { JwtPayload } from 'jsonwebtoken'
import type { UserModel } from 'models'
import type { Request } from 'express'
import type { Types } from 'mongoose'

export interface ExtendedAuthRequest extends Request {
  url: string
  cookies: {
    refreshToken: string
    language: 'en' | 'ka'
  }
  currentUser?: UserModel
}

export interface AuthRequest<ReqBody = {}, ReqParams = {}, ReqQuery = {}>
  extends ExtendedAuthRequest {
  body: ReqBody
  params: ReqParams
  query: ReqQuery
}

export interface RequestParams<ReqParams> extends ExtendedAuthRequest {
  params: ReqParams
}

export interface RequestBody<ReqBody> extends ExtendedAuthRequest {
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends ExtendedAuthRequest {
  query: ReqQuery
}

export type AccessToken = {
  accessToken: string
}

export type Token = {
  token: string
}

export interface AccessTokenPayload extends JwtPayload {
  email: string
  id: string
}

export enum Weekday {
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday',
  SUNDAY = 'Sunday',
}

export enum ActivityType {
  PRACTICE = 'Practice',
  LECTURE = 'Lecture',
  SEMINAR = 'Seminar',
  OTHER = 'Other',
  Exam = 'Exam',
  LAB = 'Lab',
}

export interface LearningActivity {
  activityType: ActivityType
  startingTime: string
  subjectName: string
  user: Types.ObjectId
  teacherName: string
  _id: Types.ObjectId
  endingTime: string
  weekday: Weekday
}

export interface TransformedErrors {
  [key: string]: string[]
}
