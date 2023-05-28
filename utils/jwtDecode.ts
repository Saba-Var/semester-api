import jwt_decode from 'jwt-decode'
import { JwtPayload } from 'types'

const jwtDecode = (jwt: string, key: 'email' | 'id') => {
  const decoded = jwt_decode<JwtPayload>(jwt)[key]

  return decoded
}

export default jwtDecode
