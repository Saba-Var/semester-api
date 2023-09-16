import type { Response as SupertestResponse } from 'supertest'
import type { UserNewPasswordData } from 'controllers'
import {
  userInfoPrivateRequest,
  updateUserDataRequest,
  signInRequest,
} from 'services'

export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  const response = await signInRequest({ email, password })

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('accessToken')
  expect(response.body).toHaveProperty('_id')
}

export const changePasswordSuccessfully = async ({
  confirmPassword,
  newPassword,
  oldPassword,
}: UserNewPasswordData) => {
  const { status, body } = await updateUserDataRequest({
    newPassword,
    oldPassword,
    confirmPassword,
  })
  expect(status).toBe(200)
  expect(body).toEqual({
    message: expect.any(String),
    _id: expect.any(String),
  })
}

export const haveMultipleProperties = async (
  target: object,
  compareObjectWithProperties: object
) => {
  for (const key in compareObjectWithProperties) {
    if (key in compareObjectWithProperties) {
      expect(target).toHaveProperty(key)
    }
  }
}

export const checkRateUniversityResults = async (
  response: SupertestResponse,
  evaluationCriteriaValues: {
    [key: string]: number
  },
  userUniversityId: string
) => {
  expect(response.body.evaluation.userEvaluations).toHaveLength(1)
  expect(response.body.evaluation.voteCount).toBe(1)

  const totalScore = Object.values(evaluationCriteriaValues).reduce(
    (acc, curr) => acc + curr,
    0
  )
  const averageRating =
    totalScore / Object.keys(evaluationCriteriaValues).length

  expect(response.body.averageRating).toBe(averageRating)
  expect(response.body.totalScore).toBe(totalScore)

  const updatedUser = await userInfoPrivateRequest()
  expect(updatedUser.body.userUniversityInfo.ratedUniversities[0]).toEqual({
    university: userUniversityId,
    ratedDate: expect.any(String),
  })
}
