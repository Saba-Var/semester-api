import { superTestMethods } from 'utils'
import { NewSemesterData } from 'types'

const { post, get, del, put } = superTestMethods.privateRequests

export const createSemesterRequest = async (data: NewSemesterData) =>
  post('/api/semesters', data)

export const allSemestersDataRequest = async () => get('/api/semesters')

export const oneSemesterDataRequest = async (id: string) =>
  get(`/api/semesters/${id}`)

export const deleteSemesterRequest = async (id: string) =>
  del(`/api/semesters/${id}`)

export const endSemesterRequest = async (
  id: string,
  data: { endDate: string }
) => put(`/api/semesters/${id}/end`, data)

export const updateSemesterRequest = async (
  id: string,
  data: NewSemesterData
) => put(`/api/semesters/${id}`, data)
