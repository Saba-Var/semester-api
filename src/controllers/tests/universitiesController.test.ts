import { universitiesDataRequest } from 'services'
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
      // eslint-disable-next-line guard-for-in
      for (const key in universities[0]) {
        expect(body.data[0]).toHaveProperty(key)
      }
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
})
