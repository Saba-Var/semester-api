import type { RequestParams } from 'types'
import type { Response } from 'express'
import { User } from 'models'

export const getUserDetails = async (
  req: RequestParams<{ id?: string }>,
  res: Response
) => {
  try {
    const user = await User.findById(req.body.currentUserId).select(
      '-password -verified -active'
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
