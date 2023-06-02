import jwtDecoder from 'jwt-decode'
import { JwtPayload } from 'types'

const jwtDecode = (jwt: string, key: 'email' | 'id') => {
  const decoded = jwtDecoder<JwtPayload>(jwt)[key]

  return decoded
}

export default jwtDecode
