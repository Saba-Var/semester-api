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

export interface UserUpdateReq extends Username {
  image?: UserImage
}
