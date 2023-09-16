import { superTestMethods } from './superTestMethods'
import type { PaginationBaseQuery } from 'types'

const { get } = superTestMethods.privateRequests

export const universitiesDataRequest = async ({
  limit = 10,
  page = 1,
}: PaginationBaseQuery = {}) =>
  get(`/api/universities?limit=${limit}&page=${page}`)
