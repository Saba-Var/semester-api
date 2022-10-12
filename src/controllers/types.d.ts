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
  confirmPassword: string
  password: string
  id: string
}

export type Id = {
  id: string
}

export type AuthorizationReq = {
  password: string
  email: string
}

export type ChangePasswordReq = {
  body: {
    password: string
  }
  query: {
    accessToken: string
  }
}
