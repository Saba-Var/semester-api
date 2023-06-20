import { check } from 'express-validator'

const endDateSchema = check('endDate')
  .trim()
  .notEmpty()
  .withMessage('end_date_is_required')
  .isDate()
  .withMessage('end_date_should_be_date')

export default endDateSchema
