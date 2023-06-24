import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { validateRequestSchema } from 'middlewares'

jest.mock('express-validator', () => ({
  validationResult: jest.fn(),
}))

describe('validateRequestSchema', () => {
  let req: Request
  let res: Partial<Response>
  let next: NextFunction

  beforeEach(() => {
    req = {} as Request
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should call next if there are no validation errors', () => {
    ;(validationResult as unknown as jest.Mock<unknown>).mockReturnValueOnce({
      isEmpty: () => true,
      array: () => [],
    })

    validateRequestSchema(req, res as Response, next)

    expect(validationResult).toHaveBeenCalledWith(req)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })

  it('should return 422 with transformed errors if there are validation errors', () => {
    const errors = {
      isEmpty: () => false,
      array: () => [
        { param: 'email', msg: 'Invalid email' },
        { param: 'password', msg: 'Password is required' },
      ],
    }
    ;(validationResult as unknown as jest.Mock<unknown>).mockReturnValueOnce(
      errors
    )

    const mockResponse = {
      errors: {
        email: ['Invalid email message'],
        password: ['Password is required message'],
      },
    }

    req.t = jest.fn().mockImplementation((msg) => `${msg} message`)

    const result = validateRequestSchema(req, res as Response, next)

    expect(validationResult).toHaveBeenCalledWith(req)
    expect(res.status).toHaveBeenCalledWith(422)
    expect(res.json).toHaveBeenCalledWith(mockResponse)
    expect(result).toBeUndefined()
  })
})
