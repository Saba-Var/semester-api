import { TestingAuthStore } from 'services'

describe('TestingAuthStore', () => {
  let testingAuthStore: TestingAuthStore

  beforeEach(() => {
    testingAuthStore = new TestingAuthStore()
  })

  it('should set and retrieve the access token', () => {
    const accessToken = 'exampleAccessToken'
    testingAuthStore.setAccessToken(accessToken)
    const retrievedToken = testingAuthStore.accessToken
    expect(retrievedToken).toBe(accessToken)
  })

  it('should execute the privateAccess callback with the access token', async () => {
    const accessToken = 'exampleAccessToken'
    const callback = jest.fn()
    testingAuthStore.setAccessToken(accessToken)
    await testingAuthStore.privateAccess(callback)
    expect(callback).toHaveBeenCalledWith({ accessToken })
  })

  it('should remove the access token', () => {
    const accessToken = 'exampleAccessToken'
    testingAuthStore.setAccessToken(accessToken)
    testingAuthStore.removeAccessToken()
    const retrievedToken = testingAuthStore.accessToken
    expect(retrievedToken).toBe('')
  })
})
