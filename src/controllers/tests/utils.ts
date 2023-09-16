import { signInRequest, updateUserDataRequest } from 'services'
import type { UserNewPasswordData } from 'controllers'

export const signInWithCredentials = async (
  email: string,
  password: string
) => {
  const response = await signInRequest({ email, password })

  expect(response.status).toBe(200)
  expect(response.body).toHaveProperty('accessToken')
  expect(response.body).toHaveProperty('_id')
}

export const changePasswordSuccessfully = async ({
  confirmPassword,
  newPassword,
  oldPassword,
}: UserNewPasswordData) => {
  const { status, body } = await updateUserDataRequest({
    newPassword,
    oldPassword,
    confirmPassword,
  })
  expect(status).toBe(200)
  expect(body).toEqual({
    message: expect.any(String),
    _id: expect.any(String),
  })
}

export const haveMultipleProperties = async (
  target: object,
  compareObjectWithProperties: object
) => {
  for (const key in compareObjectWithProperties) {
    if (key in compareObjectWithProperties) {
      expect(target).toHaveProperty(key)
    }
  }
}
