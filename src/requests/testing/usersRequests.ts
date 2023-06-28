import { superTestMethods } from 'utils'

const { privateRequests, publicRequests } = superTestMethods

export const userInfoPrivateRequest = async () =>
  privateRequests.get('/api/users/info')

export const userInfoPublicRequest = () => publicRequests.get('/api/users/info')
