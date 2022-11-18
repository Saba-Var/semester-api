import { NextFunction, Response } from 'express'
import { AuthReqBody } from './types'
import jwt from 'jsonwebtoken'

const verifyToken = (req: AuthReqBody, res: Response, next: NextFunction) => {
  try {
    const { authorization, Authorization } = req.headers

    const authHeader = authorization || Authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Missing authorization headers. Unauthorized access!',
      })
    }

    const accessToken = authHeader.trim().split(' ')[1]

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (error) => {
      if (error) {
        return res.status(403).json({
          message: 'User is not authorized to continue!',
        })
      }
    })

    return next()
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export default verifyToken
