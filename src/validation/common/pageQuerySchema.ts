import { query } from 'express-validator'

export const pageQuerySchema = query('page')
  .optional()
  .isInt({ min: 1 })
  .withMessage('page_must_be_a_positive_number')
