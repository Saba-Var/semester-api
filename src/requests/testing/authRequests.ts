import { superTestMethods } from 'utils'
import { ChangePasswordData } from 'types'

const { post, get, put } = superTestMethods.publicRequests

export const signUpRequest = async (data: object) =>
  post('/api/authentication/sign-up').send(data)

export const signInRequest = async (data: object) =>
  post('/api/authentication/sign-in').send(data)

export const activateAccountRequest = async (token: string) =>
  post(`/api/authentication/activate-account${token ? `?token=${token}` : ``}`)

export const passwordChangeEmailRequest = async (email: string) =>
  get(`/api/authentication/change-password?email=${email}`)

export const changePasswordRequest = async (
  accessToken: string,
  data: ChangePasswordData
) =>
  put(`/api/authentication/change-password?accessToken=${accessToken}`).send(
    data
  )

export const refreshTokenRequest = async (refreshToken: string) =>
  get('/api/authentication/refresh').set('Cookie', [
    `refreshToken=${refreshToken}`,
  ])
