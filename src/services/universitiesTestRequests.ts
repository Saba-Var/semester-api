import type { PaginationBaseQuery, UniversityRatingsRequestData } from 'types'
import { superTestMethods } from './superTestMethods'

const { get, patch } = superTestMethods.privateRequests

export const universitiesDataRequest = async ({
  limit = 10,
  page = 1,
}: PaginationBaseQuery = {}) =>
  get(`/api/universities?limit=${limit}&page=${page}`)

export const oneUniversityDataRequest = async (id: string) =>
  get(`/api/universities/${id}`)

export const rateUniversityRequest = async (
  id: string,
  data: UniversityRatingsRequestData | {}
) => patch(`/api/universities/${id}/rate`, data)
