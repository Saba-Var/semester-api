import type { UserUpdateReq } from 'controllers'
import { superTestMethods } from 'utils'

const { privateRequests } = superTestMethods

export const userInfoPrivateRequest = async () =>
  privateRequests.get('/api/user')

export const updateUserDataRequest = async (data: UserUpdateReq) =>
  privateRequests.put('/api/user', data)
