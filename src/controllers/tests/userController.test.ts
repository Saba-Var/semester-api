import { signInWithCredentials, changePasswordSuccessfully } from './utils'
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

    describe('Update password', () => {
      const newPassword = 'StrongPassword!123'

      it('Should return 422 if invalid password provided (less than 6 chars)', async () => {
        const { status } = await updateUserDataRequest({
          newPassword: '12345',
          oldPassword: '12345',
          confirmPassword: '12345',
        })
        expect(status).toBe(422)
      })

      it('Should return 422 if password requirements does not met', async () => {
        const { status, body } = await updateUserDataRequest({
          newPassword: 'newPassword',
          oldPassword: TEST_USER_CREDENTIALS.password,
          confirmPassword: 'newPassword',
        })
        expect(status).toBe(422)
        expect(body.errors.newPassword).toEqual([
          'New password should include at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character.',
        ])
      })

      it('Should return 401 if incorrect password provided', async () => {
        const { status, body } = await updateUserDataRequest({
          newPassword,
          oldPassword: 'incorrectPassword',
          confirmPassword: newPassword,
        })
        expect(status).toBe(401)
        expect(body.message).toBe('Password is incorrect!')
      })

      it('Should return 200 if password changed successfully', async () => {
        await changePasswordSuccessfully({
          oldPassword: TEST_USER_CREDENTIALS.password!,
          confirmPassword: newPassword,
          newPassword,
        })
      })

      it('Should return 200 if logged in with new password', async () => {
        await signInWithCredentials(TEST_USER_CREDENTIALS.email!, newPassword)
      })

      it('Should return 200 password changed to previous one', async () => {
        await changePasswordSuccessfully({
          confirmPassword: TEST_USER_CREDENTIALS.password!,
          newPassword: TEST_USER_CREDENTIALS.password!,
          oldPassword: newPassword,
        })
      })

      it('Should return 200 if logged with new password which was the original one', async () => {
        await signInWithCredentials(
          TEST_USER_CREDENTIALS.email!,
          TEST_USER_CREDENTIALS.password!
        )
      })
    })
  })
})
