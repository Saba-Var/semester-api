import type { Response } from 'supertest'
import { superTestMethods } from 'utils'

const { post, get } = superTestMethods.supertestObject

export const signUpRequest = async (data: object): Promise<Response> =>
  post('/api/authentication/sign-up').send(data)

export const signInRequest = async (data: object): Promise<Response> =>
  post('/api/authentication/sign-in').send(data)

export const activateAccountRequest = async (
  token: string
): Promise<Response> =>
  post(`/api/authentication/activate-account${token ? `?token=${token}` : ``}`)

export const passwordChangeEmailRequest = async (email: string) =>
  get(`/api/authentication/change-password?email=${email}`)
