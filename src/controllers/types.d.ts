export type NewUserReqBody = {
  username: string
  password: string
  email: string
}

export type Email = {
  email: string
}

export type RegisterGoogleMemberReq = {
  username: string
  email: string
}

export type NewPasswordReq = {
  password: string
  token: string
  id: string
}

export type Id = {
  id: string
}
