import type { ExtendedAuthRequest } from 'types'
import { Response } from 'express'
import { User } from 'models'

export const getUserDetails = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.currentUser?._id).select(
      '-password -verified -active'
    )

    if (!user) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    return res.status(200).json(user)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
