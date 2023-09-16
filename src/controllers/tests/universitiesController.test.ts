import { universitiesDataRequest, oneUniversityDataRequest } from 'services'
import { haveMultipleProperties } from './utils'
import { universities } from 'data'

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
})
