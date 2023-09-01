import { ExtendedAuthRequest, AccessTokenPayload } from 'types'
import { NextFunction, Response } from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

export const verifyToken = (
  req: ExtendedAuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization, Authorization } = req.headers

    const authHeader = (authorization || Authorization || '') as string

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: req.t('missing_authorization_headers'),
      })
    }

    const accessToken = authHeader.trim().split(' ')[1]

    return jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      async (error, JwtPayload) => {
        if (error) {
          return res.status(401).json({
            message: req.t('user_is_not_authorized_to_continue'),
          })
        }

        const { email, _id, role } = JwtPayload as AccessTokenPayload & {
          role: string
        }

        const isValidId = mongoose.Types.ObjectId.isValid(_id)

        if (!isValidId || !email || !_id) {
          return res.status(401).json({
            message: req.t('user_is_not_authorized_to_continue'),
          })
        }

        req.currentUser = { email, _id, role }

        return next()
      }
    )
  } catch (error) {
    return next(error)
  }
}
