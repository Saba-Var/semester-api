import { testingAuthStore } from 'store'
import supertest from 'supertest'
import server from 'server'

export class SuperTestMethods {
  // eslint-disable-next-line no-use-before-define
  private static instance: SuperTestMethods

  supertestObject: supertest.SuperTest<supertest.Test>

  constructor() {
    this.supertestObject = supertest(server)
  }

  static getInstance(): SuperTestMethods {
    if (!SuperTestMethods.instance) {
      SuperTestMethods.instance = new SuperTestMethods()
    }
    return SuperTestMethods.instance
  }

  privateRequest(
    method: 'get' | 'delete' | 'put' | 'post',
    path: string,
    sendData?: object
  ) {
    return testingAuthStore.privateAccess(async ({ accessToken }) =>
      this.supertestObject[method](path)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(sendData || undefined)
    )
  }

  privateGet(path: string, sendData?: object) {
    return this.privateRequest('get', path, sendData)
  }

  privatePost(path: string, sendData?: object) {
    return this.privateRequest('post', path, sendData)
  }

  privatePut(path: string, sendData?: object) {
    return this.privateRequest('put', path, sendData)
  }

  privateDelete(path: string, sendData?: object) {
    return this.privateRequest('delete', path, sendData)
  }
}

export const superTestMethods = SuperTestMethods.getInstance()
