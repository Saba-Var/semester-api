import { superTestMethods } from './superTestMethods'
import { LearningActivityPartial } from 'types'

const { post } = superTestMethods.privateRequests

export const createLearningActivity = async (data: LearningActivityPartial) =>
  post('/api/learning-activities', data)
