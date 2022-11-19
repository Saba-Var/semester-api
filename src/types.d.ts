import { Request, Response } from 'express'

type JsonType = Send<{ message: string }, this>

type Cookies = { refreshToken: string; language: 'en' | 'ka' }

export interface Request<ReqBody> extends ExpressRequest {
  cookies: Cookies
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends ExpressRequest {
  cookies: Cookies
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
