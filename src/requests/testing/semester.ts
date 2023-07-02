import { superTestMethods } from 'utils'
import { NewSemesterData } from 'types'

const { privateRequests } = superTestMethods

export const createSemesterRequest = async (data: NewSemesterData) =>
  privateRequests.post('/api/semesters', data)
