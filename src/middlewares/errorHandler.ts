import type { Request, Response, NextFunction } from 'express'
import type { CustomError } from 'types'
import { logger } from 'utils'

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  const message = err.message || req.t('internal_server_error')

  logger.error(message, {
    method: req.method,
    params: req.params,
    query: req.query,
    stack: err.stack,
    body: req.body,
    url: req.url,
  })

  return res.status(err.status || 500).json({
    message: err.message || req.t('internal_server_error'),
  })
}
