import { userInfoPrivateRequest, updateUserDataRequest } from 'requests'
import { TEST_USER_CREDENTIALS } from 'data'
import { superTestMethods } from 'utils'

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
        username: TEST_USER_CREDENTIALS.username,
        email: TEST_USER_CREDENTIALS.email,
        activeSemester: null,
        semesters: [],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        image: expect.any(Object),
        role: 'user',
        userUniversityInfo: expect.any(Object),
        lastActive: expect.any(String),
      })
    })
  })

  describe('Update user details - PUT /api/user', () => {
    describe('Update username', () => {
      it('Should return 422 if invalid username provided', async () => {
        const { status } = await updateUserDataRequest({
          username: 's',
        })
        expect(status).toBe(422)
      })

      it('Should return 200 if username changed successfully', async () => {
        const updateResponse = await updateUserDataRequest({
          username: TEST_USER_CREDENTIALS.username,
        })
        const userInfoResponse = await userInfoPrivateRequest()

        expect(updateResponse.status).toBe(200)
        expect(userInfoResponse.body.username).toBe(
          TEST_USER_CREDENTIALS.username
        )
      })
    })
  })
})
