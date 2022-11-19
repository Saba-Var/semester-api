import { Response, RequestQuery } from 'types.d'
import { jwtDecode } from 'utils'
import { User } from 'models'

export const getUserDetails = async (
  req: RequestQuery<{ accessToken: string }>,
  res: Response
) => {
  try {
    const { accessToken } = req.query

    const id = jwtDecode(accessToken, 'id')

    const user = await User.findById(id).select('-password -verified -active')

    if (!user) {
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
