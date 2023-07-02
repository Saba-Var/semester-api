import { superTestMethods } from 'utils'
import { NewSemesterData } from 'types'

const { privateRequests } = superTestMethods

export const createSemesterRequest = async (data: NewSemesterData) =>
  privateRequests.post('/api/semesters', data)

export const allSemestersDataRequest = async () =>
  privateRequests.get('/api/semesters')

export const oneSemesterDataRequest = async (id: string) =>
  privateRequests.get(`/api/semesters/${id}`)

export const deleteSemesterRequest = async (id: string) =>
  privateRequests.delete(`/api/semesters/${id}`)

export const endSemesterRequest = async (
  id: string,
  data: { endDate: string }
) => privateRequests.put(`/api/semesters/${id}/end`, data)
