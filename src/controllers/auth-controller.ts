import { sendEmail, validEmail } from 'utils'
import jwt_decode from 'jwt-decode'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import {
  RegisterGoogleMemberReq,
  AuthorizationReq,
  NewUserReqBody,
  NewPasswordReq,
  Email,
  Id,
} from './types'
import {
  RequestBody,
  Response,
  RequestQuery,
  AccessToken,
  JwtPayload,
} from 'types.d'

export const registerUser = async (
  req: RequestBody<NewUserReqBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body

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
        'activate-account',
        email,
        res,
        {
          id: newUser.id,
        }
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
      return res.status(401).json({
        message:
          'Account is not active. Check your email to verify your account.',
      })
    }
    const devEnvironment = process.env.NODE_ENV === 'production'

    const jwtPayload = { id: currentUser?.id, email }

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: devEnvironment ? '10s' : '10m',
    })
    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: devEnvironment ? '4h' : '7d' }
    )

    res.cookie('refreshToken', refreshToken, {
      secure: devEnvironment,
      maxAge: 7 * 8640000,
      sameSite: 'None',
      httpOnly: true,
    })

    return res.status(200).json({ accessToken })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const userAccountActivation = async (
  req: RequestQuery<AccessToken>,
  res: Response
) => {
  try {
    const { accessToken } = req.query

    if (!accessToken) {
      return res.status(422).json({
        message: 'JWT token is missing',
      })
    }

    const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)

    if (verified) {
      const userId = jwt_decode<Id>(accessToken).id

      const existingUser = await User.findById(userId)
      if (!existingUser) {
        return res.status(404).json({ message: 'User is not found' })
      } else if (existingUser.active) {
        return res.status(200).json({
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

export const registerGoogleUser = async (
  req: RequestBody<RegisterGoogleMemberReq>,
  res: Response
) => {
  try {
    const { username, email } = req.body

    const existingUser = await User.findOne({ email })

    let accessToken = ''

    if (!existingUser) {
      const newUser = await User.create({ username, email })
      newUser.active = true
      await newUser.save()
      accessToken = jwt.sign(
        { id: newUser.id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: '10m',
        }
      )
    } else {
      if (existingUser.password) {
        return res.status(409).json({
          message: 'User with this email address already exists',
        })
      }
      accessToken = jwt.sign(
        { id: existingUser.id },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: '10m',
        }
      )
    }

    return res.status(200).json({
      accessToken,
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
      id: existingUser.id,
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
    const { password, accessToken } = req.body

    const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
    if (!verified) {
      return res.status(401).json({
        message: 'JWT is not valid!',
      })
    }

    const userId = jwt_decode<Id>(accessToken).id

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found!' })
    }

    if (!existingUser.password) {
      return res.status(409).json({
        message:
          "User is registered with google account. You can't change password of google user!",
      })
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
      const userId = jwt_decode<JwtPayload>(refreshToken).id
      const email = jwt_decode<JwtPayload>(refreshToken).email
      if (!userId || !email)
        return res.status(401).json({ message: 'Unauthorized Access!' })

      const existingUser = await User.findById(userId)
      if (!existingUser || existingUser.email !== email) {
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
