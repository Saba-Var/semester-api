import type { Response, NextFunction } from 'express'
import type { ExtendedAuthRequest } from 'types'
import { User } from 'models'

export const getUserDetails = async (
  req: ExtendedAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.currentUser?._id).select(
      '-password -verified -active'
    )

    if (!user) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    return res.status(200).json(user)
  } catch (error) {
    return next(error)
  }
}
