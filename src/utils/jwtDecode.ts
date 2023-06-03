import { AccessTokenPayload } from 'types'
import jwtDecoder from 'jwt-decode'

const jwtDecode = (jwt: string, key: 'email' | 'id') => {
  const decoded = jwtDecoder<AccessTokenPayload>(jwt)[key]

  return decoded
}

export default jwtDecode
