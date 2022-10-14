import { validationResult } from 'express-validator'
import { ValidateResultReq } from './types.d'
import { NextFunction } from 'express'
import { Response } from 'types'

const validateRequestSchema = (
  req: ValidateResultReq,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() })
  }

  next()
}
export default validateRequestSchema
