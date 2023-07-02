import { AccessToken } from 'types'

export class TestingAuthStore {
  // eslint-disable-next-line no-use-before-define
  private static instance: TestingAuthStore

  accessToken = ''

  refreshToken = ''

  currentUserId = ''

  static getInstance(): TestingAuthStore {
    if (!TestingAuthStore.instance) {
      TestingAuthStore.instance = new TestingAuthStore()
    }
    return TestingAuthStore.instance
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  setRefreshToken(refreshToken: string) {
    this.refreshToken = refreshToken
  }

  setCurrentUserId(userId: string) {
    this.currentUserId = userId
  }

  async privateAccess<T>(callback: (data: AccessToken) => T): Promise<T> {
    return callback({ accessToken: this.accessToken })
  }

  removeAccessToken() {
    this.accessToken = ''
  }
}

export const testingAuthStore = TestingAuthStore.getInstance()
