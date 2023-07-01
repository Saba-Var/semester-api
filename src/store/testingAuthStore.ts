import { AccessToken } from 'types'

export class TestingAuthStore {
  // eslint-disable-next-line no-use-before-define
  private static instance: TestingAuthStore

  accessToken = ''

  refreshToken = ''

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

  async privateAccess<T>(callback: (data: AccessToken) => T): Promise<T> {
    return callback({ accessToken: this.accessToken })
  }

  removeAccessToken() {
    this.accessToken = ''
  }

  removeRefreshToken() {
    this.refreshToken = ''
  }
}

export const testingAuthStore = TestingAuthStore.getInstance()
