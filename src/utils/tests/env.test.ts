import dotenv from 'dotenv'

dotenv.config()

describe('test env', () => {
  it('test env variables which are necessary for testing database connection', () => {
    expect(process.env.TESTING_DATABASE_URI).not.toBeUndefined()
    expect(process.env.TESTING_USER_EMAIL).not.toBeUndefined()
    expect(process.env.TESTING_USER_PASSWORD).not.toBeUndefined()
    expect(process.env.TESTING_USER_USERNAME).not.toBeUndefined()
  })
})
