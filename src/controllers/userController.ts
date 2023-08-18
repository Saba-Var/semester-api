import type { Response, NextFunction } from 'express'
import { sendEmail } from 'utils'
import bcrypt from 'bcryptjs'
import { User } from 'models'
import type {
  ExtendedAuthRequest,
  RequestQuery,
  RequestBody,
  UserImage,
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
  req: RequestBody<{ image: UserImage }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.currentUser?._id)

    if (!user) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    if (req.body.image.type === 'dicebear') {
      user.image = req.body.image
      await user.save()
    }

    return res.status(200).json({
      message: req.t('user_details_updated_successfully'),
      _id: user._id,
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

export const changePasswordOfLoggedInUser = async (
  req: RequestBody<{ newPassword: string; oldPassword: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const currentUser = await User.findById(req.currentUser?._id)

    if (!currentUser) {
      return res.status(404).json({ message: req.t('user_not_found') })
    }

    const { newPassword, oldPassword } = req.body

    const isMatch = await bcrypt.compare(oldPassword, currentUser.password!)

    if (!isMatch) {
      return res.status(401).json({
        message: req.t('credentials_are_incorrect'),
      })
    }

    currentUser.password = await bcrypt.hash(newPassword, 12)
    await currentUser.save()

    return res.json({ message: req.t('password_changed_successfully') })
  } catch (error) {
    return next(error)
  }
}
