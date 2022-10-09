import { RequestBody, Response, RequestQuery, Token } from 'types.d'
import { sendEmail, validEmail } from 'utils'
import jwt_decode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import {
  RegisterGoogleMemberReq,
  NewUserReqBody,
  NewPasswordReq,
  Email,
} from './types'

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
      const salt = await bcrypt.genSalt()
      const hashedPassword = await bcrypt.hash(password, salt)
      await User.create({ username, email, password: hashedPassword })
    }

    return sendEmail('Activate your account!', 'activate-account', email, res, {
      email,
    })
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

    if (!token) {
      return res.status(422).json({
        message: 'JWT token is missing',
      })
    }

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
      return res.status(403).json({
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

export const registerGoogleUser = async (
  req: RequestBody<RegisterGoogleMemberReq>,
  res: Response
) => {
  try {
    const { username, email } = req.body

    const existingUser = await User.findOne({ email })

    const token = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '15h',
    })

    if (!existingUser) {
      const newUser = await User.create({ username, email })
      newUser.verified = true
      await newUser.save()
    } else {
      if (existingUser.password) {
        return res.status(409).json({
          message: 'User with this email address already exists',
        })
      }
    }

    return res.status(200).json({
      token,
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const passwordChangeRequestEmail = async (
  req: RequestQuery<Email>,
  res: Response
) => {
  try {
    const { email } = req.query

    if (!validEmail(email)) {
      return res.status(422).json({ message: 'Enter valid email address' })
    }

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' })
    } else if (!existingUser.password) {
      return res.status(409).json({
        message:
          "User is registered with google account. You can't change password of google user!",
      })
    }

    return sendEmail('Change password', 'change-password', email, res, {
      email,
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const changePassword = async (
  req: RequestBody<NewPasswordReq>,
  res: Response
) => {
  try {
    const { password, token } = req.body

    const verified = jwt.verify(token, process.env.JWT_SECRET!)
    if (!verified) {
      return res.status(401).json({
        message: 'JWT is not valid!',
      })
    }

    const email = jwt_decode<Email>(token).email

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' })
    }

    if (!existingUser.password) {
      return res.status(409).json({
        message:
          "User is registered with google account. You can't change password of google user!",
      })
    }

    const salt = await bcrypt.genSalt()
    existingUser.password = await bcrypt.hash(password, salt)
    await existingUser.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
