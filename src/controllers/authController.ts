import { AuthorizationReq, NewUserReqBody, Email } from './types'
import { sendEmail, jwtDecode, generateFieldError } from 'utils'
import type { Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import type {
  ExtendedAuthRequest,
  RequestQuery,
  AuthRequest,
  RequestBody,
  Token,
} from 'types'

export const registerUser = async (
  req: RequestBody<NewUserReqBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body
    const { language } = req.cookies

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(409)
        .json(generateFieldError('email', req.t('user_is_already_registered')))
    }

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
        _id: newUser._id,
      },
      language,
      201
    )
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
        message: req.t('credentials_are_incorrect'),
      })
    }

    if (!currentUser.active) {
      return res.status(403).json({
        message: req.t('account_is_not_active'),
      })
    }
    const devEnvironment = process.env.NODE_ENV === 'production'

    const jwtPayload = { _id: currentUser?._id, email }

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: devEnvironment ? '1d' : '1h',
    })

    const refreshToken = jwt.sign(
      jwtPayload,
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: devEnvironment ? '4h' : '7d' }
    )

    res.cookie('refreshToken', refreshToken, {
      secure: true,
      maxAge: 7 * 8640000,
      sameSite: 'strict',
      httpOnly: true,
    })

    return res.status(200).json({ accessToken, _id: currentUser._id })
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
      const userId = jwtDecode(token, '_id')
      const existingUser = await User.findById(userId)
      if (!existingUser) {
        return res.status(404).json({ message: req.t('account_not_found') })
      }

      if (existingUser.active) {
        return res.status(409).json({
          message: req.t('account_is_already_active'),
        })
      }

      await User.updateOne({ _id: userId }, { active: true })

      return res.status(200).json({
        message: req.t('account_activated_successfully'),
      })
    }

    return res.status(403).json({
      message: req.t('user_is_not_authorized_to_activate_account'),
    })
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
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    return sendEmail(
      'Change password',
      'reset-password',
      email,
      res,
      {
        _id: existingUser._id,
      },
      language
    )
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const changePassword = async (
  req: AuthRequest<
    { password: string },
    {},
    {
      accessToken: string
    }
  >,
  res: Response
) => {
  try {
    const { accessToken } = req.query
    const { password } = req.body

    const verified = jwt.verify(
      accessToken,
      process.env.CHANGE_PASSWORD_TOKEN_SECRET!
    )
    if (!verified) {
      return res.status(401).json({
        message: req.t('jwt_is_not_valid'),
      })
    }

    const userId = jwtDecode(accessToken, '_id')

    const existingUser = await User.findById(userId)

    if (!existingUser) {
      return res.status(401).json({ message: req.t('unauthorized_access') })
    }

    existingUser.password = await bcrypt.hash(password, 12)
    await existingUser.save()

    return res
      .status(200)
      .json({ message: req.t('password_changed_successfully') })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const refresh = async (req: RequestBody<{}>, res: Response) => {
  try {
    const refreshToken = req?.cookies?.refreshToken

    if (!refreshToken) {
      return res.status(401).json({ message: req.t('unauthorized_access') })
    }

    const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!)
    if (verified) {
      const userId = jwtDecode(refreshToken, '_id')
      const email = jwtDecode(refreshToken, 'email')

      const existingUser = await User.findById(userId)

      if (!email || !existingUser || existingUser.email !== email) {
        return res.status(401).json({ message: req.t('unauthorized_access') })
      }

      const accessToken = jwt.sign(
        { _id: existingUser._id, email: existingUser.email },
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: process.env.NODE_ENV === 'production' ? '1h' : '10m',
        }
      )

      return res.status(200).json({ accessToken })
    }

    return res.status(401).json({
      message: req.t('refresh_token_is_invalid'),
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const logout = async (req: ExtendedAuthRequest, res: Response) => {
  res.clearCookie('refreshToken', {
    secure: true,
    sameSite: 'strict',
    httpOnly: true,
  })

  return res.status(200).json({ message: req.t('log_out_success') })
}
