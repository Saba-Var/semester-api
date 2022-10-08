import { Response } from 'types.d'
import mailgun from 'mailgun-js'
import jwt from 'jsonwebtoken'

const sendEmail = async (
  subject: string,
  emailTemplateType: 'account-activation',
  to: string,
  res: Response,
  jwtData: object
) => {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY!,
    domain: process.env.MAILGUN_DOMAIN!,
  })

  const jwtToken = jwt.sign(jwtData, process.env.JWT_SECRET!)

  const data = {
    html: `<h1>${process.env
      .FRONTEND_URI!}/account-activation?token=${jwtToken}<h1>`,
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
      return res.status(201).json({
        message: 'Check your gmail to activate your account!',
      })
    }
  })
}

export default sendEmail
