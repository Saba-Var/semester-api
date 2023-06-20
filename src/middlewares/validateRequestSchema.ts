import type { NextFunction, Request, Response } from 'express'
import { validationResult } from 'express-validator'
import type { TransformedErrors } from 'types'

const validateRequestSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)

  const transformedErrors: TransformedErrors = {}

  errors.array().forEach((error) => {
    const { param, msg } = error
    if (!transformedErrors[param]) {
      transformedErrors[param] = []
    }
    transformedErrors[param].push(req.t(msg))
  })

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: transformedErrors })
  }

  return next()
}
export default validateRequestSchema
