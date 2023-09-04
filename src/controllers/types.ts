import type { UserImage } from 'types'
import type { Types } from 'mongoose'

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
  university?: Types.ObjectId
  confirmPassword?: string
  oldPassword?: string
  newPassword?: string
  image?: UserImage
  username?: string
}
