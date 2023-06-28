import { superTestMethods } from 'utils'

const { post } = superTestMethods.supertestObject

export const signUpRequest = async (data: object) =>
  post('/api/authentication/sign-up').send(data)
