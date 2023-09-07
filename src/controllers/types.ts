import { evaluationCriterias } from 'data'
import type { UserImage } from 'types'

export type Email = {
  email: string
}

export type Password = {
  password: string
}

export type Username = {
  username: string
}

export type Id = {
  _id: string
}

export interface NewUserReqBody extends Email, Password, Username {}

export interface RegisterGoogleMemberReq extends Username, Email {}

export interface NewPasswordReq extends Password, Id {
  confirmPassword: string
}

export interface AuthorizationReq extends Password, Email {}

export interface UserUpdateReq {
  confirmPassword?: string
  oldPassword?: string
  newPassword?: string
  university?: string
  image?: UserImage
  username?: string
}

export type UniversityRatingsRequestData = {
  [keyof in typeof evaluationCriterias[number]]: number
}

export type UserNewPasswordData = {
  confirmPassword: string
  newPassword: string
  oldPassword: string
}
