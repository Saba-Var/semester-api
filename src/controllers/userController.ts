import type { Response, NextFunction } from 'express'
import { sendEmail, generateAuthTokens } from 'utils'
import type { UserUpdateReq } from './types'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import type {
  ExtendedAuthRequest,
  RequestQuery,
  RequestBody,
  Token,
} from 'types'

export const getUserDetails = async (
  req: ExtendedAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.currentUser?._id).select(
      '-password -verified -active'
    )

    if (!user) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    return res.status(200).json(user)
  } catch (error) {
    return next(error)
  }
}

export const updateUserDetails = async (
  req: RequestBody<UserUpdateReq>,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await User.findById(req.currentUser?._id)
    if (!currentUser) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    const { username, image, password: newPassword, oldPassword } = req.body

    if (image?.type === 'dicebear') {
      currentUser.image = image
    }

    if (username) {
      currentUser.username = username
    }

    if (newPassword && oldPassword) {
      const isMatch = await bcrypt.compare(oldPassword, currentUser.password!)

      if (!isMatch) {
        return res.status(401).json({
          message: req.t('password_is_incorrect'),
        })
      }

      currentUser.password = await bcrypt.hash(newPassword, 12)
    }

    await currentUser.save()

    return res.status(200).json({
      message: req.t('user_details_updated_successfully'),
      _id: currentUser._id,
    })
  } catch (error) {
    return next(error)
  }
}

export const changeEmailRequest = async (
  req: RequestQuery<{ newEmail: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { newEmail } = req.query
    const { language } = req.cookies

    const existingUser = await User.findById(req.currentUser?._id)
    if (!existingUser) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    const isEmailUsed = await User.findOne({ email: newEmail })

    if (isEmailUsed) {
      return res.status(409).json({
        message: req.t('email_is_already_in_use'),
      })
    }

    return sendEmail(
      'Change email confirmation',
      'change-email',
      existingUser.email,
      res,
      {
        newEmail,
      },
      language
    )
  } catch (error) {
    return next(error)
  }
}

export const activateNewEmail = async (
  req: RequestQuery<Token>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query

    return jwt.verify(
      token,
      process.env.CHANGE_EMAIL_TOKEN_SECRET!,
      async (error, jwtPayload) => {
        if (error) {
          return res.status(403).json({
            message: req.t('unauthorized_access'),
          })
        }

        const { newEmail } = jwtPayload as { newEmail: string }

        const existingUser = await User.findById(req.currentUser?._id)
        if (!existingUser) {
          return res.status(404).json({ message: req.t('user_not_found') })
        }

        const isEmailAvailable = await User.findOne({ email: newEmail })
        if (isEmailAvailable) {
          return res.status(409).json({
            message: req.t('email_is_already_in_use'),
          })
        }

        existingUser.email = newEmail
        await existingUser.save()

        const { accessToken, refreshToken } = generateAuthTokens({
          _id: existingUser?._id,
          email: newEmail,
        })

        res.cookie('refreshToken', refreshToken, {
          secure: true,
          maxAge: 7 * 8640000,
          sameSite: 'strict',
          httpOnly: true,
        })

        return res.status(200).json({
          message: req.t('email_activated_successfully'),
          _id: existingUser._id,
          accessToken,
        })
      }
    )
  } catch (error) {
    return next(error)
  }
}
