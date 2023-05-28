import { Request } from 'express'

export interface AuthReqBody extends Request {
  cookies: {
    token: string
  }
  url: string
  headers: {
    Authorization: string
    authorization: string
  }
}
