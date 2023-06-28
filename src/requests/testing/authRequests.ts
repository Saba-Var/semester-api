import { superTestMethods } from 'utils'

const { post, get } = superTestMethods.publicRequests

export const signUpRequest = async (data: object) =>
  post('/api/authentication/sign-up').send(data)

export const signInRequest = async (data: object) =>
  post('/api/authentication/sign-in').send(data)

export const activateAccountRequest = async (token: string) =>
  post(`/api/authentication/activate-account${token ? `?token=${token}` : ``}`)

export const passwordChangeEmailRequest = async (email: string) =>
  get(`/api/authentication/change-password?email=${email}`)
