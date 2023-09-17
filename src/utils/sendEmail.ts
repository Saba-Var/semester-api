import type { SendEmailParameters } from './types'
import mailgun from 'mailgun-js'
import { logger } from 'utils'
import dotenv from 'dotenv'
import path from 'path'
import pug from 'pug'

dotenv.config()

export const sendEmail = async ({
  htmlViewPath,
  responseData,
  redirectUri,
  callbackFn,
  statusCode,
  subject,
  token,
  res,
  to,
}: SendEmailParameters) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  })

  const html = pug.renderFile(
    path.join(__dirname, `../views/${htmlViewPath}`),
    {
      redirectUri,
    }
  )

  const mailgunData = {
    from: process.env.EMAIL_SENDER!,
    subject,
    html,
    to,
  }

  return mg.messages().send(mailgunData, (error: any) => {
    if (error) {
      logger.error(error.message, {
        stack: error.stack,
      })

      return res.status(500).json({
        message: error.message,
      })
    }

    const data = { ...responseData } as any

    if (process.env.NODE_ENV !== 'production') {
      data.token = token
    }

    if (callbackFn) callbackFn()

    return res.status(statusCode || 200).json(data)
  })
}
