import { superTestMethods } from 'utils'

const { get } = superTestMethods.supertestObject

describe('User Controller', () => {
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

    it("Should return 200 if user's details are returned successfully", () => {
      superTestMethods.privateGet('/api/user').then((res: any) => {
        expect(res.status).toBe(200)
      })
    })
  })
})
