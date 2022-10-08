import { RequestBody, Response } from 'types.d'
import { NewUserReqBody } from './types'
import { sendEmail } from 'utils'
import bcrypt from 'bcryptjs'
import { User } from 'models'

export const registerUser = async (
  req: RequestBody<NewUserReqBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      if (existingUser.verified) {
        return res.status(409).json({ message: 'User is already registered!' })
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      await User.create({ username, email, password: hashedPassword })
    }

    return sendEmail(
      'Activate your account!',
      'account-activation',
      email,
      res,
      {
        email,
        username,
      }
    )
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
