import type { CustomError, ExtendedAuthRequest } from 'types'
import type { Response, NextFunction } from 'express'
import { logger } from 'utils'

export const errorHandler = (
  err: CustomError,
  req: ExtendedAuthRequest,
  res: Response,
  _next: NextFunction
) => {
  const message = err.message || req.t('internal_server_error')

  // logger.error(message, {
  //   user: req.currentUser,
  //   method: req.method,
  //   params: req.params,
  //   query: req.query,
  //   stack: err.stack,
  //   body: req.body,
  //   url: req.url,
  // })

  return res.status(err.status || 500).json({
    message: err.message || req.t('internal_server_error'),
  })
}
