import { Request, Response } from 'express'

type JsonType = Send<{ message: string }, this>

type Cookies = { refreshToken: string; language: 'en' | 'ka' }

type Params = { id: string }

export interface Request<ReqBody> extends Request {
  cookies: Cookies
  params: Params
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends Request {
  cookies: Cookies
  query: ReqQuery
  params: Params
}

export interface Response extends Response {
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
