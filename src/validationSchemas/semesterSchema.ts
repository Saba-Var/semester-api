import { check } from 'express-validator'

const semesterValidationSchema = [
  check('name').trim().notEmpty().withMessage('semester_name_is_required'),

  check('startDate')
    .trim()
    .notEmpty()
    .withMessage('start_date_is_required')
    .isDate()
    .withMessage('start_date_should_be_date'),
]
export default semesterValidationSchema
