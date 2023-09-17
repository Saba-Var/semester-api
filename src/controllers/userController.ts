import type { Response, NextFunction } from 'express'
import { sendEmail, generateAuthTokens } from 'utils'
import type { UserUpdateReq } from './types'
import { University, User } from 'models'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import type {
  ExtendedAuthRequest,
  RequestQuery,
  RequestBody,
  Token,
} from 'types'

dotenv.config()

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

    const { username, image, newPassword, oldPassword, university } = req.body

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

    if (university) {
      const isUniversityExist = await University.findById(university)

      if (!isUniversityExist) {
        return res.status(404).json({
          message: req.t('university_not_found'),
        })
      }

      const { userUniversityInfo } = currentUser

      const universityUpdateDate = new Date()

      const universityObjectId = new mongoose.Types.ObjectId(university)

      const selectUniversity = () => {
        userUniversityInfo.allUniversities.push({
          selectedDate: universityUpdateDate,
          university: universityObjectId,
        })
        userUniversityInfo.currentUniversity = {
          universityId: universityObjectId,
          selectedDate: universityUpdateDate,
        }
        userUniversityInfo.selectedDate = universityUpdateDate
      }

      const universitySelectedDate =
        userUniversityInfo.currentUniversity.selectedDate

      if (!universitySelectedDate) {
        selectUniversity()
      } else {
        const currentDate = new Date()
        const twoMonths = 5184000000
        const selectTimeDifferenceBetweenUniversitySelections =
          currentDate.getTime() - universitySelectedDate.getTime()
        const daysLeft = Math.floor(
          (twoMonths - selectTimeDifferenceBetweenUniversitySelections) /
            86400000
        )

        if (selectTimeDifferenceBetweenUniversitySelections < twoMonths) {
          return res.status(403).json({
            message: req.t('you_can_change_university_once_in_two_months', {
              daysLeft,
            }),
          })
        }

        if (
          isUniversityExist._id.toString() ===
          userUniversityInfo.currentUniversity?.universityId?.toString()
        ) {
          return res.status(409).json({
            message: req.t('you_already_have_this_university_as_current', {
              universityName:
                isUniversityExist.name[req.cookies.language || 'en'],
            }),
          })
        }

        selectUniversity()
      }
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
        email: req.t('email_is_already_in_use'),
      })
    }

    const jwtData = { newEmail }

    const token = jwt.sign(jwtData, process.env.CHANGE_EMAIL_TOKEN_SECRET!, {
      expiresIn: '3h',
    })

    const responseData = {
      message: req.t('change_email_request_email_instructions'),
    }

    const redirectUri = `${process.env.FRONTEND_URI!}${
      language === 'en' ? '/en' : ''
    }/profile?emailToken=${token}`

    return sendEmail({
      htmlViewPath: 'emails/templates/change-email.pug',
      subject: 'Change email confirmation',
      to: newEmail,
      responseData,
      redirectUri,
      token,
      res,
    })
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
          email: newEmail,
        })
      }
    )
  } catch (error) {
    return next(error)
  }
}
