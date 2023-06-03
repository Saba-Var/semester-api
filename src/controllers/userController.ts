import { Request, Response } from 'express'
import { User } from 'models'

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const user = await User.findById(id).select('-password -verified -active')

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
