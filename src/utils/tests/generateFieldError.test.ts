import { generateFieldError } from 'utils'

describe('generateFieldError function', () => {
  test('returns an object with the provided fieldName and message', () => {
    const fieldName = 'email'
    const message = 'Email is required'

    expect(generateFieldError(fieldName, message)).toEqual({
      errors: {
        [fieldName]: message,
      },
    })
  })

  test('does not return an object with the provided fieldName and message', () => {
    const fieldName = 'email'
    const message = 'Email is required'

    expect(generateFieldError(fieldName, message)).not.toEqual({
      errors: {
        [fieldName]: 'Password is required',
      },
    })
  })
})
