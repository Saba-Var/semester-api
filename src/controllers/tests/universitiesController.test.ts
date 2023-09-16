import { haveMultipleProperties, checkRateUniversityResults } from './utils'
import {
  evaluationCriteriasValues,
  evaluationCriterias,
  universities,
} from 'data'
import {
  universitiesDataRequest,
  oneUniversityDataRequest,
  userInfoPrivateRequest,
  rateUniversityRequest,
} from 'services'

describe('Universities Controller', () => {
  describe('Fetch all universities - GET /api/universities', () => {
    it('Should return 200 if universities are fetched successfully', async () => {
      const { status, body } = await universitiesDataRequest()

      expect(status).toBe(200)
      expect(body.data).not.toHaveLength(0)
      expect(body.paginationInfo).toEqual({
        page: 1,
        limit: 10,
        totalItems: expect.any(Number),
        lastPage: expect.any(Number),
      })
      haveMultipleProperties(body.data[0], universities[0])
    })

    it('Should return 200 if universities are fetched successfully with pagination', async () => {
      const { status, body } = await universitiesDataRequest({
        page: 2,
        limit: 5,
      })

      expect(status).toBe(200)
      expect(body.data).toHaveLength(5)
    })

    it("Should return 422 if pagination params aren't valid", async () => {
      const { status, body } = await universitiesDataRequest({
        page: 'invalid',
        limit: 'invalid',
      })

      expect(status).toBe(422)
      expect(body.errors).toEqual({
        limit: expect.any(Array),
        page: expect.any(Array),
      })
    })

    it('Should return 422 if pagination params are negative numbers', async () => {
      const { status, body } = await universitiesDataRequest({
        page: -2,
        limit: -1,
      })

      expect(status).toBe(422)
      expect(body.errors).toEqual({
        limit: expect.any(Array),
        page: expect.any(Array),
      })
    })
  })

  describe('Get information about specific university - GET /api/universities/:id', () => {
    it("Should return 422 if university's id is invalid", async () => {
      const { status, body } = await oneUniversityDataRequest('invalid')

      expect(status).toBe(422)
      expect(body.errors).toEqual({
        id: ['Invalid mongoDB id!'],
      })
    })

    it('Should return 404 if university not found', async () => {
      const { status, body } = await oneUniversityDataRequest(
        '6505e203fcb1022be8b31f75'
      )

      expect(status).toBe(404)
      expect(body.message).toBe('University not found!')
    })

    it('Should return 200 if university data fetched successfully', async () => {
      const allUniversitiesResponse = await universitiesDataRequest()
      const { status, body } = await oneUniversityDataRequest(
        allUniversitiesResponse.body.data[0]._id
      )

      expect(status).toBe(200)
      haveMultipleProperties(body, universities[0])
    })
  })

  describe('Rate university - PATCH /api/universities/:id/rate', () => {
    it("Should return 422 if university's id is invalid", async () => {
      const { status, body } = await rateUniversityRequest('invalid', {})

      expect(status).toBe(422)
      expect(body.errors.id).toEqual(['Invalid mongoDB id!'])
    })

    it('Should return 200 if university rated successfully', async () => {
      const userResponse = await userInfoPrivateRequest()

      const userUniversityId =
        userResponse.body.userUniversityInfo.currentUniversity.universityId

      const rateResponse = await rateUniversityRequest(
        userUniversityId,
        evaluationCriteriasValues
      )
      expect(rateResponse.status).toBe(200)
      expect(rateResponse.body).toEqual({
        message: expect.any(String),
        _id: userUniversityId,
      })

      const universityInfoResponse = await oneUniversityDataRequest(
        userUniversityId
      )

      const universityCriterias =
        universityInfoResponse.body.evaluation.criterias

      for (const key in universityCriterias) {
        if (key in universityCriterias && key in evaluationCriteriasValues) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(universityCriterias[key].averageScore).toBe(
            evaluationCriteriasValues[
              key as keyof typeof evaluationCriteriasValues
            ]
          )
        }
      }

      checkRateUniversityResults(
        universityInfoResponse,
        evaluationCriteriasValues,
        userUniversityId
      )
    })

    it('Should return 403 if user tries to rate university where she/he have not learned', async () => {
      const universitiesResponse = await universitiesDataRequest()

      const { status, body } = await rateUniversityRequest(
        universitiesResponse.body.data[3]._id,
        evaluationCriteriasValues
      )

      expect(status).toBe(403)
      expect(body).toHaveProperty('message')
    })

    it('Should return 200 if previous evaluation updated successfully', async () => {
      const userResponse = await userInfoPrivateRequest()

      const userUniversityId =
        userResponse.body.userUniversityInfo.currentUniversity.universityId

      const updatedEvaluationCriterias: {
        [key: string]: number
      } = {}

      const newEvaluationValue = 10

      evaluationCriterias.forEach((criteriaName) => {
        updatedEvaluationCriterias[criteriaName] = newEvaluationValue
      })

      const rateResponse = await rateUniversityRequest(
        userUniversityId,
        updatedEvaluationCriterias
      )
      expect(rateResponse.status).toBe(200)

      const universityInfoResponse = await oneUniversityDataRequest(
        userUniversityId
      )

      const universityCriterias =
        universityInfoResponse.body.evaluation.criterias

      for (const key in universityCriterias) {
        if (key in universityCriterias && key in updatedEvaluationCriterias) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(universityCriterias[key].averageScore).toBe(newEvaluationValue)
        }
      }

      checkRateUniversityResults(
        universityInfoResponse,
        updatedEvaluationCriterias,
        userUniversityId
      )
    })
  })
})
