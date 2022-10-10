import { RequestBody, Response, RequestQuery, AccessToken } from 'types.d'
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

    const currentUser = await User.findOne({ email })
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found!' })
    }

    const isMatch = await bcrypt.compare(password, currentUser?.password!)
    if (isMatch) {
      if (!currentUser.verified) {
        return res.status(401).json({
          message:
            'Account is not verified. Check your email to verify your account.',
        })
      }

      const jwtPayload = { id: currentUser?.id }

      const accessToken = jwt.sign(
        jwtPayload,
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: '10m',
        }
      )

      const refreshToken = jwt.sign(
        jwtPayload,
        process.env.REFRESH_TOKEN_SECRET!
      )

      return res.status(200).json({ accessToken, refreshToken })
    } else {
      return res.status(403).json({
        message: 'Credentials are incorrect',
      })
    }
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
        return res.status(404).json({ message: 'User is not registered yet!' })
      } else if (existingUser.verified) {
        return res.status(200).json({
          message: 'Account is already activated',
        })
      }

      await User.updateOne({ id: userId }, { verified: true })

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
      newUser.verified = true
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
