import { superTestMethods } from 'utils'

const { get } = superTestMethods.privateRequests

export const universitiesDataRequest = async () => get('/api/universities')
