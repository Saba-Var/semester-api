import type { RateLimitRequestHandler } from 'express-rate-limit'
import { PrivateRequests, RequestMethods } from 'types'
import { testingAuthStore } from 'services'
import { authLimiter } from 'middlewares'
import supertest from 'supertest'
import server from 'server'

export class SuperTestMethods {
  // eslint-disable-next-line no-use-before-define
  private static instance: SuperTestMethods

  privateRequests: PrivateRequests

  publicRequests: supertest.SuperTest<supertest.Test>

  constructor() {
    const authLimiterMiddlewareIndex = server?._router?.stack?.findIndex(
      (middleware: { handle: RateLimitRequestHandler }) =>
        middleware?.handle === authLimiter
    )
    // disable authLimiter middleware for testing purposes
    if (authLimiterMiddlewareIndex) {
      server._router?.stack?.splice(authLimiterMiddlewareIndex, 1)
    }

    this.publicRequests = supertest(server)

    this.privateRequests = {
      get: (path: string, sendData?: object) =>
        this.privateRequest('get', path, sendData),

      post: (path: string, sendData?: object) =>
        this.privateRequest('post', path, sendData),

      put: (path: string, sendData?: object) =>
        this.privateRequest('put', path, sendData),

      del: (path: string, sendData?: object) =>
        this.privateRequest('delete', path, sendData),
    }
  }

  static getInstance(): SuperTestMethods {
    if (!SuperTestMethods.instance) {
      SuperTestMethods.instance = new SuperTestMethods()
    }
    return SuperTestMethods.instance
  }

  private async privateRequest(
    method: RequestMethods,
    path: string,
    sendData?: object
  ) {
    const response = await testingAuthStore.privateAccess(
      async ({ accessToken }) =>
        this.publicRequests[method](path)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(sendData || '')
    )

    return response
  }
}

export const superTestMethods = SuperTestMethods.getInstance()
