import type { Request, Response, NextFunction } from 'express'
import type { CustomError } from 'types'

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) =>
  res.status(err.status || 500).json({
    message: err.message || req.t('internal_server_error'),
  })
