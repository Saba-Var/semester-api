import { superTestMethods } from 'utils'

const { privateRequests } = superTestMethods

export const userInfoPrivateRequest = async () =>
  privateRequests.get('/api/user')
