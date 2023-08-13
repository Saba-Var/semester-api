import type { ExtendedAuthRequest, RequestBody, UserImage } from 'types'
import type { Response, NextFunction } from 'express'
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

export const updateUserDetails = async (
  req: RequestBody<{ image: UserImage }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.currentUser?._id)

    if (!user) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    if (req.body.image.type === 'dicebear') {
      user.image = req.body.image
      await user.save()
    }

    return res.status(200).json({
      message: req.t('user_details_updated_successfully'),
      _id: user._id,
    })
  } catch (error) {
    return next(error)
  }
}
