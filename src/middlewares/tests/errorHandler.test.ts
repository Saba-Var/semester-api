import { Request, Response } from 'express'
import { errorHandler } from 'middlewares'

describe('errorHandler function', () => {
  const mockRequest = {} as Request
  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Response & { status: jest.Mock } & { json: jest.Mock }
  const mockNext = jest.fn()

  test('should set the response status and send JSON error message', () => {
    const mockError = {
      name: 'CustomError',
      status: 400,
      message: 'Bad Request',
    }

    errorHandler(mockError, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Bad Request',
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  test('should set the response status to 500 if error status is not provided', () => {
    const mockError = {
      message: 'Internal Server Error',
      name: 'CustomError',
      status: 500,
    }

    errorHandler(mockError, mockRequest, mockResponse, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal Server Error',
    })
    expect(mockNext).not.toHaveBeenCalled()
  })
})
