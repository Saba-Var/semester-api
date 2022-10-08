import { RequestBody, Response, RequestQuery, Token } from 'types.d'
import { NewUserReqBody, Email } from './types'
import jwt_decode from 'jwt-decode'
import { sendEmail } from 'utils'
import jwt from 'jsonwebtoken'
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

export const userAccountActivation = async (
  req: RequestQuery<Token>,
  res: Response
) => {
  try {
    const { token } = req.query

    const verified = jwt.verify(token, process.env.JWT_SECRET!)
    if (verified) {
      const email = jwt_decode<Email>(token).email

      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        return res.status(404).json({ message: 'User is not registered yet!' })
      } else if (existingUser.verified) {
        return res.status(200).json({
          message: 'Account is already activated',
        })
      }

      await User.updateOne({ email }, { verified: true })

      return res.status(200).json({
        message: 'Account activated successfully!',
      })
    } else {
      return res.status(401).json({
        message:
          'User is not authorized to activate account. Token verification failed!',
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
