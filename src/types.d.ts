import { JwtPayload } from 'jsonwebtoken'
import type { IUserModel } from 'models'
import type { Request } from 'express'
import type { Types } from 'mongoose'
import supertest from 'supertest'

export interface ExtendedAuthRequest extends Request {
  url: string
  cookies: {
    refreshToken: string
    language: 'en' | 'ka'
  }
  currentUser?: { email: string; _id: string }
}

export interface AuthRequest<ReqBody = {}, ReqParams = {}, ReqQuery = {}>
  extends ExtendedAuthRequest {
  body: ReqBody
  params: ReqParams
  query: ReqQuery
}

export interface RequestParams<ReqParams = {}> extends ExtendedAuthRequest {
  params: ReqParams
}

export interface RequestBody<ReqBody = {}> extends ExtendedAuthRequest {
  body: ReqBody
}

export interface RequestQuery<ReqQuery = {}> extends ExtendedAuthRequest {
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
  _id: string
}

export type ChangePasswordData = {
  password: string
  confirmPassword: string
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

export interface LearningActivityPartial {
  subjectName: string
  teacherName: string
  weekday: Weekday
  activityType: ActivityType
  startingTime: string
  endingTime: string
  semester: Types.ObjectId
}

export interface ILearningActivityModel extends LearningActivityPartial {
  user: Types.ObjectId
}

export type NewSemesterData = {
  name: string
  startDate: string
}

export interface TransformedErrors {
  [key: string]: string[]
}

export interface CustomError extends Error {
  status?: number
}

export type UserId = Types.ObjectId

export type RequestMethods = 'get' | 'post' | 'put' | 'delete'

export type SuperTestRequest = (
  path: string,
  sendData?: object
) => Promise<supertest.Response>

export type PrivateRequests = {
  get: SuperTestRequest
  post: SuperTestRequest
  put: SuperTestRequest
  del: SuperTestRequest
}

export type UserImage = {
  url: string
  type: 'dicebear' | 'upload'
}
