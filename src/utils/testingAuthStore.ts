import { AccessToken } from 'types'

export class TestingAuthStore {
  // eslint-disable-next-line no-use-before-define
  private static instance: TestingAuthStore

  accessToken = ''

  static getInstance(): TestingAuthStore {
    if (!TestingAuthStore.instance) {
      TestingAuthStore.instance = new TestingAuthStore()
    }
    return TestingAuthStore.instance
  }

  setAccessToken(token: string) {
    this.accessToken = token
  }

  async privateAccess<T>(callback: (data: AccessToken) => T): Promise<T> {
    return callback({ accessToken: this.accessToken })
  }

  removeAccessToken() {
    this.accessToken = ''
  }
}

export const testingAuthStore = TestingAuthStore.getInstance()
