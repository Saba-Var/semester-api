import { check } from 'express-validator'

const endDateSchema = check('endDate')
  .trim()
  .notEmpty()
  .withMessage("'endDate' is required")
  .isDate()
  .withMessage("'endDate' should be a date")

export default endDateSchema
