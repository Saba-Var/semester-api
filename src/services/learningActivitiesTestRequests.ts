import { superTestMethods } from './superTestMethods'
import { LearningActivityPartial } from 'types'

const { post, get, put } = superTestMethods.privateRequests

export const getOneLearningActivityRequest = async (id: string) =>
  get(`/api/learning-activities/${id}`)

export const getLearningActivitiesOfSemesterRequest = async (id: string) =>
  get(`/api/learning-activities/semesters/${id}`)

export const createLearningActivity = async (data: LearningActivityPartial) =>
  post('/api/learning-activities', data)

export const updateLearningActivityRequest = async (
  id: string,
  data: LearningActivityPartial
) => put(`/api/learning-activities/${id}`, data)
