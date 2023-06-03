import { JwtPayload } from 'jsonwebtoken'
import type { Request } from 'express'
import type { Types } from 'mongoose'

export interface ExtendedAuthRequest extends Request {
  url: string
  cookies: {
    refreshToken: string
    language: 'en' | 'ka'
  }
  currentUserId: string
  currentUserEmail: string
}

export interface AuthRequest<ReqBody = {}, ReqParams = {}, ReqQuery = {}>
  extends ExtendedAuthRequest {
  body: ReqBody
  ReqParams: ReqParams
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
  LAB = 'Lab',
}

export interface LearningActivity {
  activity_type: ActivityType
  starting_time: string
  subject_name: string
  user: Types.ObjectId
  teacher_name: string
  _id: Types.ObjectId
  ending_time: string
  weekday: Weekday
}
