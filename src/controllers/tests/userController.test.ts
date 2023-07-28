import { userInfoPrivateRequest } from 'requests'
import { superTestMethods } from 'utils'
import { TEST_USER } from 'data'

describe('User Controller', () => {
  const { get } = superTestMethods.publicRequests

  describe('Get user details - GET /api/user', () => {
    it('Should return 401 if access token not provided', async () => {
      const response = await get('/api/user')
      expect(response.status).toBe(401)
    })

    it('Should return 401 if token is invalid', async () => {
      const response = await get('/api/user').set('Authorization', `Bearer 123`)

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'User is not authorized to continue. Unauthorized access!',
      })
    })

    it("Should return 200 if user's details are returned successfully", async () => {
      const { status, body } = await userInfoPrivateRequest()

      expect(status).toBe(200)
      expect(body).toEqual({
        _id: expect.any(String),
        username: TEST_USER.username,
        email: TEST_USER.email,
        activeSemester: null,
        image: null,
        semesters: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      })
    })
  })
})
