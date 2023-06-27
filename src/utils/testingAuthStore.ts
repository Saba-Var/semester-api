import { AccessToken } from 'types'

export class TestingAuthStore {
  accessToken = ''

  set setAccessToken(token: string) {
    this.accessToken = token
  }

  get getAccessToken() {
    return this.accessToken
  }

  async privateAccess<T>(callback: (data: AccessToken) => T): Promise<T> {
    return callback({ accessToken: this.getAccessToken })
  }

  removeAccessToken() {
    this.accessToken = ''
  }
}

export const testingAuthStore = new TestingAuthStore()
