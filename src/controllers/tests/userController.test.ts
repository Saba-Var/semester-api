import { signInWithCredentials, changePasswordSuccessfully } from './utils'
import { TEST_USER_CREDENTIALS } from 'data'
import { superTestMethods } from 'utils'
import {
  changeEmailRequestByGmail,
  universitiesDataRequest,
  activateNewEmailRequest,
  userInfoPrivateRequest,
  updateUserDataRequest,
} from 'requests'

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

    describe('Update university', () => {
      let userNewUniversityId = ''

      it('Should return 422 if invalid university provided', async () => {
        const { status } = await updateUserDataRequest({
          university: '123',
        })

        expect(status).toBe(422)
      })

      it('Should return 404 if university not found', async () => {
        const { status } = await updateUserDataRequest({
          university: '62f8517a3cbc660a065e0f15',
        })

        expect(status).toBe(404)
      })

      it('Should return 200 if university changed successfully', async () => {
        const { body } = await universitiesDataRequest()
        expect(body.data.length).toBeGreaterThan(0)

        userNewUniversityId = body.data[0]._id

        const userResponse = await updateUserDataRequest({
          university: userNewUniversityId,
        })

        expect(userResponse.status).toBe(200)
        expect(userResponse.body.message).toBe(
          'User details updated successfully!'
        )

        const updatedUserResponse = await userInfoPrivateRequest()
        const { currentUniversity, allUniversities, ratedUniversities } =
          updatedUserResponse.body.userUniversityInfo

        expect(currentUniversity.universityId).toBe(userNewUniversityId)
        expect(allUniversities.length).toBe(1)
        expect(ratedUniversities.length).toBe(0)
      })

      it('Should return 403 if 2 moth is not passed after last selection', async () => {
        const { body } = await universitiesDataRequest()

        const { status } = await updateUserDataRequest({
          university: body.data[1]._id,
        })

        expect(status).toBe(403)

        const userResponse = await userInfoPrivateRequest()
        expect(
          userResponse.body.userUniversityInfo.allUniversities.length
        ).toBe(1)
      })
    })

    describe('Update email', () => {
      let firstEmailChangeToken = ''

      it('Should return 422 if invalid email provided', async () => {
        const { status } = await changeEmailRequestByGmail('@invalidEmail')

        expect(status).toBe(422)
      })

      it('Should return 409 if email is in use', async () => {
        const { status, body } = await changeEmailRequestByGmail(
          TEST_USER_CREDENTIALS.email!
        )

        expect(status).toBe(409)
        expect(body.email).toBe('Email is already in use!')
      })

      it('Should return 200 if change email sent successfully', async () => {
        const { status, body } = await changeEmailRequestByGmail(
          process.env.TESTING_USER_EMAIL_SECOND!
        )
        firstEmailChangeToken = body.token

        expect(status).toBe(200)
        expect(body).toHaveProperty('token')
      })

      it('Should return 403 if token is invalid', async () => {
        const { status } = await activateNewEmailRequest('invalid_token')

        expect(status).toBe(403)
      })

      it('Should return 200 if email activated successfully', async () => {
        const { status, body, headers } = await activateNewEmailRequest(
          firstEmailChangeToken
        )

        expect(status).toBe(200)
        expect(body).toEqual({
          message: expect.any(String),
          _id: expect.any(String),
          accessToken: expect.any(String),
          email: expect.any(String),
        })

        const refreshToken = headers['set-cookie']
          .find((el: string) => el.includes('refreshToken'))
          .split('=')[1]
          .split(';')[0]

        expect(refreshToken).not.toBeUndefined()
      })

      it('Should return 200 if logged in with new email', async () => {
        await signInWithCredentials(
          process.env.TESTING_USER_EMAIL_SECOND!,
          TEST_USER_CREDENTIALS.password!
        )
      })

      it('Should return 409 if requested new email is in use', async () => {
        const { status, body } = await activateNewEmailRequest(
          firstEmailChangeToken
        )

        expect(status).toBe(409)
        expect(body.message).toBe('Email is already in use!')
      })

      it('Should return 200 if email changed back to previous one', async () => {
        const { body } = await changeEmailRequestByGmail(
          TEST_USER_CREDENTIALS.email!
        )
        const emailActivationToken = body.token

        await activateNewEmailRequest(emailActivationToken)

        await signInWithCredentials(
          TEST_USER_CREDENTIALS.email!,
          TEST_USER_CREDENTIALS.password!
        )
      })
    })
  })
})
