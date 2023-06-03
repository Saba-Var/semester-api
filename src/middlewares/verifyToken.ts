import { ExtendedAuthRequest, AccessTokenPayload } from 'types'
import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'

const verifyToken = (
  req: ExtendedAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization, Authorization } = req.headers

    const authHeader = authorization || Authorization

    if (!!authHeader && typeof authHeader === 'string') {
      if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          message: 'Missing authorization headers. Unauthorized access!',
        })
      }

      const accessToken = authHeader.trim().split(' ')[1]

      return jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET!,
        (error, JwtPayload) => {
          if (error) {
            return res.status(401).json({
              message: 'User is not authorized to continue!',
            })
          }

          const { email, id } = JwtPayload as AccessTokenPayload

          req.body.currentUserId = id
          req.body.currentUserEmail = email

          return next()
        }
      )
    }

    return res.status(401).json({
      message: 'Missing authorization headers. Unauthorized access!',
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export default verifyToken
