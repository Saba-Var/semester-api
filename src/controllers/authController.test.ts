import { setupTestingDatabase } from 'utils'

describe('authorization', () => {
  const { post } = setupTestingDatabase()

  describe('Sign in - POST /api/authentication/sign-in', () => {
    it('Should return 401 if credentials are incorrect', async () => {
      const response = await post('/api/authentication/sign-in').send({
        email: 'incorrect@gmail.com',
        password: 'incorrectPassword',
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Credentials are incorrect',
      })
    })

    it('Should return 403 if account is not activated', async () => {
      const { body, status } = await post('/api/authentication/sign-in').send({
        email: process.env.TESTING_USER_EMAIL,
        password: process.env.TESTING_USER_PASSWORD,
      })
      expect(status).toBe(403)
      expect(body).not.toHaveProperty('accessToken')
      expect(body).not.toHaveProperty('_id')
      expect(body.message).toBe(
        'Account is not active. Check your email to verify your account.'
      )
    })

    it('Should return 422 if email is invalid and password not provided', async () => {
      const response = await post('/api/authentication/sign-in').send({
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
