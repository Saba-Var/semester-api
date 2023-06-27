import { setupTestingDatabase, testingAuthStore } from 'utils'

describe('authorization', () => {
  const { post } = setupTestingDatabase()

  let activationToken: string | null = null

  describe('Sign up - POST /api/authentication/sign-up', () => {
    const userRegistrationData = {
      email: process.env.TESTING_USER_EMAIL,
      password: process.env.TESTING_USER_PASSWORD,
      confirmPassword: process.env.TESTING_USER_PASSWORD,
      username: process.env.TESTING_USER_USERNAME,
    }

    const signUpRequest = async (data: object = userRegistrationData) =>
      post('/api/authentication/sign-up').send(data)

    it('Should return 201 if user registered successfully', async () => {
      const { status, body } = await signUpRequest()
      expect(status).toBe(201)
      expect(body).toHaveProperty('token')
      activationToken = body.token
    })

    it('Should return 409 if user with the same email is already registered', async () => {
      const { status } = await signUpRequest()
      expect(status).toBe(409)
    })

    it('should return 422 if data not provided', async () => {
      const { status } = await signUpRequest({})
      expect(status).toBe(422)
    })
  })

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
    const activateAccount = async (token = activationToken) =>
      post(`/api/authentication/activate-account?token=${token}`)

    it('Should return 200 if user account activated successfully', async () => {
      const { body, status } = await activateAccount()
      expect(status).toBe(200)
      expect(body.message).toBe('Account activated successfully!')
    })

    it('Should return 409 if user account already activated', async () => {
      const { body, status } = await activateAccount()
      expect(status).toBe(409)
      expect(body.message).toBe('Account is already activated!')
    })

    it('Should return 200 if user signed in successfully', async () => {
      const { body, status } = await post('/api/authentication/sign-in').send({
        email: process.env.TESTING_USER_EMAIL,
        password: process.env.TESTING_USER_PASSWORD,
      })

      const { accessToken } = body

      if (accessToken) {
        testingAuthStore.setAccessToken(accessToken)
      }

      expect(status).toBe(200)
      expect(body).toHaveProperty('accessToken')
      expect(body).toHaveProperty('_id')
    })
  })
})
