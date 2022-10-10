import jwt, { JwtPayload } from 'jsonwebtoken'
import { Response, Next } from 'types'
import { AuthBody } from './types.d'

const authenticateToken = (req: AuthBody, res: Response, next: Next) => {
  try {
    const url = req.url

    if (
      url.includes('/authentication/sign-up') ||
      url.includes('/authentication/change-password-request')
    ) {
      return next()
    } else {
      const { authorization } = req.headers

      if (!authorization) {
        return res.status(401).json({
          message: 'Missing authorization headers',
        })
      }

      const accessToken = authorization.trim().split(' ')[1]

      let verified: string | JwtPayload
      verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)

      if (verified) {
        return next()
      }

      return res.status(401).json({ message: 'User is not authorized' })
    }
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export default authenticateToken
