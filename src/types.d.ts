type JsonType = Send<{ message: string }, this>

export type Next = () => void

export interface RequestBody<ReqBody> extends Express.Request {
  cookies: { refreshToken: '' }
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends Express.Request {
  query: ReqQuery
}

export interface Response extends Express.Response {
  cookie: (name: string, value: string, {}) => void
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
