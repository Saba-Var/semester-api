import { LearningActivityPartial } from 'types'
import { superTestMethods } from 'utils'

const { post } = superTestMethods.privateRequests

export const createLearningActivity = async (data: LearningActivityPartial) =>
  post('/api/learning-activities', data)
