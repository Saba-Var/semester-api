import type { Response } from 'express'

export type PaginateParams = {
  model: any
  query?: {
    limit?: string | number
    page?: string | number
  }
}

export type SendEmailParameters = {
  callbackFn?: () => void
  htmlViewPath?: string
  responseData?: object
  redirectUri?: string
  statusCode?: number
  subject: string
  token?: string
  res: Response
  to: string
}
