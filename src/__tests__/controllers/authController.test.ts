import { setupTestingDatabase } from 'utils'
import { createServer } from 'createServer'
import supertest from 'supertest'

describe('authorization', () => {
  setupTestingDatabase()

  describe('Sign in - POST /api/authentication/sign-in', () => {
    it('Should return 401 if credentials are incorrect', async () => {
      const response = await supertest(createServer())
        .post('/api/authentication/sign-in')
        .send({
          email: 'incorrect@gmail.com',
          password: 'incorrectPassword',
        })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Credentials are incorrect',
      })
    })

    it('Should return 200 and access token if credentials are correct', async () => {
      const response = await supertest(createServer())
        .post('/api/authentication/sign-in')
        .send({
          email: process.env.TESTING_USER_EMAIL,
          password: process.env.TESTING_USER_PASSWORD,
        })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('accessToken')
      expect(response.body).toHaveProperty('_id')
      expect(response.header['set-cookie'][0]).toMatch(/refreshToken/)
    })

    it('Should return 422 if email is invalid and password not provided', async () => {
      const response = await supertest(createServer())
        .post('/api/authentication/sign-in')
        .send({
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
