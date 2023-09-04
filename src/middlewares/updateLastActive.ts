import type { NextFunction, Response } from 'express'
import type { ExtendedAuthRequest } from 'types'
import { User } from 'models'

export const updateLastActive = async (
  req: ExtendedAuthRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    if (req.currentUser?._id) {
      await User.updateOne(
        { _id: req.currentUser._id },
        { lastActive: new Date() }
      )
    }

    return next()
  } catch (error) {
    return next(error)
  }
}
