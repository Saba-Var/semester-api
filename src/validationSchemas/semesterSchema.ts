import { check } from 'express-validator'

const semesterValidationSchema = [
  check('name').trim().notEmpty().withMessage('Semester name is required'),

  check('startDate')
    .trim()
    .notEmpty()
    .withMessage("'startDate' is required")
    .isDate()
    .withMessage("'startDate' should be a date"),

  check('isCurrentSemester')
    .optional()
    .isBoolean()
    .withMessage("'isCurrentSemester' should be a boolean"),
]
export default semesterValidationSchema
