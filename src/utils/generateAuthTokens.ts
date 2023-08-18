import jwt from 'jsonwebtoken'

export const generateAuthTokens = (jwtPayload: object) => {
  const devEnvironment = process.env.NODE_ENV === 'production'

  const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: devEnvironment ? '1d' : '1h',
  })

  const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: devEnvironment ? '4h' : '7d',
  })

  return { accessToken, refreshToken }
}
