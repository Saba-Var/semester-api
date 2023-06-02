import { Request as ExpressRequest } from 'express'

type Cookies = { refreshToken: string; language: 'en' | 'ka' }

type Params = { id: string }

export interface Request<ReqBody> extends ExpressRequest {
  cookies: Cookies
  params: Params
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends Request {
  cookies: Cookies
  query: ReqQuery
  params: Params
}

export type AccessToken = {
  accessToken: string
}

export type JwtPayload = {
  email: string
  id: string
}

export type Token = {
  token: string
}
