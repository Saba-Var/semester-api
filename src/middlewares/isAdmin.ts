import { NextFunction, Response } from 'express'
import { ExtendedAuthRequest } from 'types'

export const isAdmin = (
  req: ExtendedAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.currentUser?.role !== 'admin') {
      return res.status(401).json({
        message: req.t('user_is_not_authorized_to_continue'),
      })
    }

    return next()
  } catch (error) {
    return next(error)
  }
}
