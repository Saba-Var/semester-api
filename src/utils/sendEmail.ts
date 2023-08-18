import type { AccessTokenPayload } from 'types'
import { Response } from 'express'
import mailgun from 'mailgun-js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import path from 'path'
import pug from 'pug'

dotenv.config()

export const sendEmail = async (
  subject: string,
  emailTemplateType: 'account-activation' | 'reset-password' | 'change-email',
  to: string,
  res: Response,
  jwtData: AccessTokenPayload | { newEmail: string; _id?: string },
  languageCookie: 'en' | 'ka',
  statusCode?: number
) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  })

  let jwtSecret =
    emailTemplateType === 'account-activation'
      ? process.env.ACTIVATION_TOKEN_SECRET!
      : process.env.CHANGE_PASSWORD_TOKEN_SECRET!

  if (emailTemplateType === 'change-email') {
    jwtSecret = process.env.CHANGE_EMAIL_TOKEN_SECRET!
  }

  const token = jwt.sign(jwtData, jwtSecret, {
    expiresIn: '3h',
  })

  let message =
    'Activation email sent. Check your gmail to activate your account!'

  if (emailTemplateType === 'reset-password') {
    message = 'Check yor gmail to reset your password!'
  }

  if (emailTemplateType === 'change-email') {
    message = 'Check yor gmail to change your email!'
  }

  let pageUri =
    emailTemplateType === 'account-activation'
      ? 'sign-up/account-activation'
      : emailTemplateType

  if (emailTemplateType === 'change-email') {
    pageUri = `profile?newEmail=${jwtData.newEmail}`
  }

  const redirectUri = `${process.env.FRONTEND_URI!}${
    languageCookie === 'en' ? '/en' : ''
  }/${pageUri}?token=${token}`

  const html = pug.renderFile(
    path.join(__dirname, `../views/emails/templates/${emailTemplateType}.pug`),
    {
      redirectUri,
    }
  )

  const data = {
    from: process.env.EMAIL_SENDER!,
    subject,
    html,
    to,
  }

  // TODO: create user after email is sent
  return mg.messages().send(data, (error) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    }

    const responseData = { message, token, _id: jwtData._id }

    if (emailTemplateType === 'change-email') {
      delete responseData._id
    }

    return res.status(statusCode || 200).json(responseData)
  })
}
