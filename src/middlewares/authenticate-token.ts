import { Response, Next } from 'types'
import { AuthBody } from './types.d'
import jwt from 'jsonwebtoken'

const authenticateToken = (req: AuthBody, res: Response, next: Next) => {
  try {
    const url = req.url

    if (url.includes('sign-up') || url.includes('change-password-request')) {
      return next()
    } else {
      const { authorization } = req.headers

      if (!authorization) {
        return res.status(401).json({
          message: 'Missing authorization headers',
        })
      }

      const accessToken = authorization.trim().split(' ')[1]

      jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (error) => {
        if (error) {
          return res.status(401).json({
            message:
              'Access token is invalid. User is not authorized to continue!',
          })
        }
      })

      return next()
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export default authenticateToken
