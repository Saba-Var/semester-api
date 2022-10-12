import { Request } from 'express'

export type ValidateResultReq = { body: {} }

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
