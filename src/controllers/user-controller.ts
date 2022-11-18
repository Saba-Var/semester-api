import { Request, Response } from 'express'
import { jwtDecode } from 'utils'
import { User } from 'models'

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const accessToken = req.query

    const email = jwtDecode(accessToken as string, 'email')
    const id = jwtDecode(accessToken as string, 'id')

    const user = await User.findById(id).select('-password -verified -active')

    if (!user || user.email !== email) {
      return res
        .status(403)
        .json({ message: 'User is not authorized to continue!' })
    }

    return res.status(200).json(user)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
