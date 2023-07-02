import { superTestMethods } from 'utils'
import { NewSemesterData } from 'types'

const { privateRequests } = superTestMethods

export const createSemesterRequest = async (data: NewSemesterData) =>
  privateRequests.post('/api/semesters', data)

export const allSemestersDataRequest = async () =>
  privateRequests.get('/api/semesters')

export const oneSemesterDataRequest = async (id: string) =>
  privateRequests.get(`/api/semesters/${id}`)
