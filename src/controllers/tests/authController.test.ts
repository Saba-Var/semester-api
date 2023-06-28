import { setupTestingDatabase } from 'utils'
import { testingAuthStore } from 'store'
import { TEST_USER } from 'CONSTANTS'
import {
  passwordChangeEmailRequest,
  activateAccountRequest,
  signUpRequest,
  signInRequest,
} from 'requests'

describe('authorization', () => {
  setupTestingDatabase()

  let activationToken: string

  describe('Sign up - POST /api/authentication/sign-up', () => {
    it('Should return 201 if user registered successfully', async () => {
      const { status, body } = await signUpRequest(TEST_USER)

      expect(status).toBe(201)
      expect(body).toHaveProperty('token')
      activationToken = body.token
    })

    it('Should return 409 if user with the same email is already registered', async () => {
      const { status } = await signUpRequest(TEST_USER)

      expect(status).toBe(409)
    })

    it('should return 422 if data not provided', async () => {
      const { status } = await signUpRequest({})

      expect(status).toBe(422)
    })
  })

  describe('Sign in - POST /api/authentication/sign-in', () => {
    it('Should return 401 if credentials are incorrect', async () => {
      const response = await signInRequest({
        email: 'incorrect@gmail.com',
        password: 'incorrectPassword',
      })

      expect(response.status).toBe(401)
      expect(response.body).toEqual({
        message: 'Credentials are incorrect',
      })
    })

    it('Should return 403 if account is not activated', async () => {
      const { body, status } = await signInRequest({
        email: TEST_USER.email,
        password: TEST_USER.password,
      })

      expect(status).toBe(403)
      expect(body).not.toHaveProperty('accessToken')
      expect(body).not.toHaveProperty('_id')
      expect(body.message).toBe(
        'Account is not active. Check your email to verify your account.'
      )
    })

    it('Should return 422 if email is invalid and password not provided', async () => {
      const response = await signInRequest({
        email: 'invalidEmail',
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

  describe('Activate Account - POST /api/activate-account', () => {
    it('Should return 200 if user account activated successfully', async () => {
      const { body, status } = await activateAccountRequest(activationToken)

      expect(status).toBe(200)
      expect(body.message).toBe('Account activated successfully!')
    })

    it('Should return 409 if user account already activated', async () => {
      const { body, status } = await activateAccountRequest(activationToken)

      expect(status).toBe(409)
      expect(body.message).toBe('Account is already activated!')
    })

    it('Should return 200 if user signed in successfully', async () => {
      const { body, status } = await signInRequest({
        email: TEST_USER.email,
        password: TEST_USER.password,
      })

      const { accessToken } = body
      if (accessToken) testingAuthStore.setAccessToken(accessToken)
      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('_id')
    })

    it('Should return 403 if activation token is invalid', async () => {
      const { body, status } = await activateAccountRequest('invalidToken')

      expect(status).toBe(403)
      expect(body.message).toBe(
        'User is not authorized to activate account. Access token verification failed!'
      )
    })

    it('Should return 422 if activation token is not provided', async () => {
      const { body, status } = await activateAccountRequest('')

      expect(status).toBe(422)
      expect(body.errors.token[0]).toBe('JWT is required!')
    })
  })

  describe('Change Password (Email request) - GET /api/authentication/change-password', () => {
    it('Should return 200 if email with password change link sent successfully', async () => {
      const { body, status } = await passwordChangeEmailRequest(
        TEST_USER.email!
      )

      expect(status).toBe(200)
      expect(body.message).toBe('Check yor gmail to reset your password!')
      expect(body).toHaveProperty('token')
    })

    it('Should return 404 if user with provided email not found', async () => {
      const { body, status } = await passwordChangeEmailRequest(
        'doesnotexist@gmail.com'
      )

      expect(status).toBe(404)
      expect(body.message).toBe('User not found!')
      expect(body).not.toHaveProperty('token')
    })
  })
})
