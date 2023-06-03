import { JwtPayload } from 'jsonwebtoken'
import type { Request } from 'express'

export interface ExtendedAuthRequest extends Request {
  url: string
  cookies: {
    refreshToken: string
    language: 'en' | 'ka'
  }
  body: {
    currentUserId: string
    currentUserEmail: string
  }
}

export interface AuthRequest<ReqBody = {}, ReqParams = {}, ReqQuery = {}>
  extends ExtendedAuthRequest {
  body: ReqBody
  ReqParams: ReqParams
  query: ReqQuery
}

export interface RequestParams<ReqParams> extends ExtendedAuthRequest {
  params: ReqParams
}

export interface RequestBody<ReqBody> extends ExtendedAuthRequest {
  body: ReqBody
}

export interface RequestQuery<ReqQuery> extends ExtendedAuthRequest {
  query: ReqQuery
}

export type AccessToken = {
  accessToken: string
}

export type Token = {
  token: string
}

export interface AccessTokenPayload extends JwtPayload {
  email: string
  id: string
}
