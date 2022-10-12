import { Response } from 'types.d'
import mailgun from 'mailgun-js'
import jwt from 'jsonwebtoken'

const sendEmail = async (
  subject: string,
  emailTemplateType: 'activate-account' | 'change-password',
  to: string,
  res: Response,
  jwtData: object
) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  })

  const jwtSecret =
    emailTemplateType === 'activate-account'
      ? process.env.ACTIVATION_TOKEN_SECRET!
      : process.env.CHANGE_PASSWORD_TOKEN_SECRET!

  const token = jwt.sign(jwtData, jwtSecret, {
    expiresIn: '30m',
  })

  let message =
    'Activation email sent. Check your gmail to activate your account!'

  if (emailTemplateType === 'change-password') {
    message = 'Check yor gmail to change your password!'
  }

  const data = {
    html: `<h1>${process.env
      .FRONTEND_URI!}/${emailTemplateType}?token=${token}<h1>`,
    from: process.env.EMAIL_SENDER!,
    subject,
    to,
  }

  return mg.messages().send(data, (error) => {
    if (error) {
      return res.status(500).json({
        message: error.message,
      })
    } else {
      return res.status(200).json({ message })
    }
  })
}

export default sendEmail
