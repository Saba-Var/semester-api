import { jwtDecode } from 'utils'

jest.mock('jwt-decode', () => (jwt: string) => {
  if (jwt === 'jwtToken') {
    return { email: 'example@gmail.com', _id: '1' }
  }

  throw new Error('Invalid JWT')
})

describe('jwtDecode function', () => {
  test('returns the decoded value for the email key', () => {
    const jwt = 'jwtToken'
    const key = 'email'

    const result = jwtDecode(jwt, key)

    expect(result).toBe('example@gmail.com')
  })

  test('returns the decoded value for the _id key', () => {
    const jwt = 'jwtToken'
    const key = '_id'

    const result = jwtDecode(jwt, key)

    expect(result).toBe('1')
  })

  test('throws an error for invalid JWT', () => {
    const jwt = 'invalidJWT'
    const key = 'email'

    expect(() => {
      jwtDecode(jwt, key)
    }).toThrow('Invalid JWT')
  })
})
