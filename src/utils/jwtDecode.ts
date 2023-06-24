import { AccessTokenPayload } from 'types'
import jwtDecoder from 'jwt-decode'

export const jwtDecode = (jwt: string, key: 'email' | '_id') => {
  const decoded = jwtDecoder<AccessTokenPayload>(jwt)[key]

  return decoded
}
