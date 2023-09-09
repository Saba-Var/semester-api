import { superTestMethods } from './superTestMethods'

const { get } = superTestMethods.privateRequests

export const universitiesDataRequest = async () => get('/api/universities')
