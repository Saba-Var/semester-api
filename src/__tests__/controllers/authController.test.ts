import { setupTestingDatabase } from 'utils'

describe('authorization', () => {
  const { request } = setupTestingDatabase()

  describe('Sign in - POST /api/authentication/sign-in', () => {
    it('Should return 401 if credentials are incorrect', async () => {
      const response = await request.post('/api/authentication/sign-in').send({
        email: 'incorrect@gmail.com',
        password: 'incorrectPassword',
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Credentials are incorrect',
      })
    })

    it('Should return 200 and access token if credentials are correct', async () => {
      const { body, status, header } = await request
        .post('/api/authentication/sign-in')
        .send({
          email: process.env.TESTING_USER_EMAIL,
          password: process.env.TESTING_USER_PASSWORD,
        })
      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('_id')
      expect(header['set-cookie'][0]).toMatch(/refreshToken/)
    })

    it('Should return 422 if email is invalid and password not provided', async () => {
      const response = await request.post('/api/authentication/sign-in').send({
        email: 'Enter valid email!',
      })

      expect(response.status).toBe(422)
      expect(response.body).toEqual({
        errors: {
          email: ['Enter valid email!'],
          password: ['Password is required!'],
        },
      })
    })
  })
})
