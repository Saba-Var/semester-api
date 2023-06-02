import { Response } from 'express'
import mailgun from 'mailgun-js'
import jwt from 'jsonwebtoken'
import path from 'path'
import pug from 'pug'

const sendEmail = async (
  subject: string,
  emailTemplateType: 'account-activation' | 'reset-password',
  to: string,
  res: Response,
  jwtData: object,
  languageCookie: 'en' | 'ka'
) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  })

  const jwtSecret =
    emailTemplateType === 'account-activation'
      ? process.env.ACTIVATION_TOKEN_SECRET!
      : process.env.CHANGE_PASSWORD_TOKEN_SECRET!

  const token = jwt.sign(jwtData, jwtSecret, {
    expiresIn: '30m',
  })

  let message =
    'Activation email sent. Check your gmail to activate your account!'

  if (emailTemplateType === 'reset-password') {
    message = 'Check yor gmail to reset your password!'
  }

  const redirectUri = `${process.env.FRONTEND_URI!}${
    languageCookie === 'en' ? '/en' : ''
  }/${
    emailTemplateType === 'account-activation'
      ? 'sign-up/account-activation'
      : emailTemplateType
  }?token=${token}`

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

    return res.status(200).json({ message })
  })
}

export default sendEmail
