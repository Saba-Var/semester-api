import { query } from 'express-validator'

export const limitQueryParam = query('limit')
  .optional()
  .isInt({ min: 1 })
  .withMessage('limit_must_be_a_positive_number')
