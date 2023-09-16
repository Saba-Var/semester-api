import { superTestMethods } from './superTestMethods'
import type { UserUpdateReq } from 'controllers'

const { privateRequests } = superTestMethods

export const userInfoPrivateRequest = async () =>
  privateRequests.get('/api/user')

export const updateUserDataRequest = async (data: UserUpdateReq) =>
  privateRequests.patch('/api/user', data)

export const changeEmailRequestByGmail = async (newEmail: string) =>
  privateRequests.get(`/api/user/change-email?newEmail=${newEmail}`)

export const activateNewEmailRequest = async (token: string) =>
  privateRequests.put(`/api/user/activate-email?token=${token}`)
