import { Request, Response } from 'express'

type JsonType = Send<{ message: string }, this>

export interface RequestBody<ReqBody> extends Request {
  cookies: { refreshToken: '' }
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends Request {
  query: ReqQuery
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
