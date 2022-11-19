import { Request as ExpressRequest, Response as ExpressRequest } from 'express'

type JsonType = Send<{ message: string }, this>

export interface Request<ReqBody> extends ExpressRequest {
  cookies: { refreshToken: string; language: 'en' | 'ka' }
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends ExpressRequest {
  query: ReqQuery
}

export interface Response extends ExpressRequest {
  cookie: (name: string, value: string, options: object) => void
  clearCookie: (name: string, options: object) => void
  status: (number: number) => { json: JsonType }
  json: JsonType
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
