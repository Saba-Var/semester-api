import { RequestQuery, Token, RequestBody, Response } from 'types.d'
import { sendEmail, jwtDecode } from 'utils'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import {
  ChangePasswordReq,
  AuthorizationReq,
  NewUserReqBody,
  Email,
} from './types'

export const registerUser = async (
  req: RequestBody<NewUserReqBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body
    const { language } = req.cookies

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({ message: 'User is already registered!' })
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      })
      return sendEmail(
        'Activate your account!',
        'account-activation',
        email,
        res,
        {
          id: newUser.id,
        },
        language
      )
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const authorization = async (
  req: RequestBody<AuthorizationReq>,
  res: Response
) => {
  try {
    const { email, password } = req.body

    let isMatch = false

    const currentUser = await User.findOne({ email })

    if (currentUser) {
      isMatch = await bcrypt.compare(password, currentUser?.password!)
    }

    if (!currentUser || !isMatch) {
      return res.status(401).json({
        message: 'Credentials are incorrect',
      })
    }

    if (!currentUser.active) {
      return res.status(403).json({
        message:
          'Account is not active. Check your email to verify your account.',
      })
    }
    const devEnvironment = process.env.NODE_ENV === 'production'

    const jwtPayload = { id: currentUser?.id, email }

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: devEnvironment ? '1d' : '10m',
    })
    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: devEnvironment ? '4h' : '7d' }
    )

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      maxAge: 7 * 8640000,
      sameSite: 'Strict',
      httpOnly: true,
    })

    return res.status(200).json({ accessToken })
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

    const verified = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET!)

    if (verified) {
      const userId = jwtDecode(token, 'id')
      const existingUser = await User.findById(userId)
      if (!existingUser) {
        return res.status(404).json({ message: 'Account not found!' })
      } else if (existingUser.active) {
        return res.status(409).json({
          message: 'Account is already activated',
        })
      }

      await User.updateOne({ id: userId }, { active: true })

      return res.status(200).json({
        message: 'Account activated successfully!',
      })
    } else {
      return res.status(403).json({
        message:
          'User is not authorized to activate account. Access token verification failed!',
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const passwordChangeRequestEmail = async (
  req: RequestQuery<Email>,
  res: Response
) => {
  try {
    const { email } = req.query
    const { language } = req.cookies

    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' })
    }

    return sendEmail(
      'Change password',
      'reset-password',
      email,
      res,
      {
        id: existingUser.id,
      },
      language
    )
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const changePassword = async (req: ChangePasswordReq, res: Response) => {
  try {
    const { accessToken } = req.query
    const { password } = req.body

    const verified = jwt.verify(
      accessToken,
      process.env.CHANGE_PASSWORD_TOKEN_SECRET!
    )
    if (!verified) {
      return res.status(401).json({
        message: 'JWT is not valid!',
      })
    }

    const userId = jwtDecode(accessToken, 'id')

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(401).json({ message: 'Unauthorized Access!' })
    }

    existingUser.password = await bcrypt.hash(password, 12)
    await existingUser.save()

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const refresh = async (req: RequestBody<{}>, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken

    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    if (verified) {
      const userId = jwtDecode(refreshToken, 'id')
      const email = jwtDecode(refreshToken, 'email')

      const existingUser = await User.findById(userId)

      if (!email || !existingUser || existingUser.email !== email) {
        return res.status(401).json({ message: 'Unauthorized Access!' })
      }

      const accessToken = jwt.sign(
        { id: existingUser.id, email: existingUser.email },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: process.env.NODE_ENV === 'production' ? '10s' : '10m',
        }
      )

      return res.status(200).json({ accessToken })
    } else {
      return res.status(403).json({
        message: 'Refresh token is invalid. Unauthorized access!',
      })
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const logout = async (_: any, res: Response) => {
  res.clearCookie('refreshToken', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    httpOnly: true,
  })

  return res
    .status(200)
    .json({ message: 'Cookie cleared. Logged out successfully.' })
}
