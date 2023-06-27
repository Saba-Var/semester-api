import { setupTestingDatabase } from 'utils'

const { get } = setupTestingDatabase()

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

    // it("Should return 200 if user's details are returned successfully", async () => {
    //   const { body } = await post('/api/authentication/sign-in').send({
    //     email: process.env.TESTING_USER_EMAIL,
    //     password: process.env.TESTING_USER_PASSWORD,
    //   })

    //   console.log(body)

    //   const response = await get('/api/user').set(
    //     'Authorization',
    //     `Bearer ${body.accessToken}`
    //   )

    //   expect(response.status).toBe(200)
    //   expect(response.body).toEqual(
    //     expect.objectContaining({
    //       _id: expect.any(String),
    //       email: expect.any(String),
    //       username: expect.any(String),
    //       active: expect.any(Boolean),
    //       activeSemester: expect.any(String),
    //       password: expect.any(String),
    //       image: expect.any(String || null),
    //       semesters: expect.any(Array),
    //       createdAt: expect.any(Date),
    //       updatedAt: expect.any(Date),
    //     })
    //   )
    // })
  })
})
