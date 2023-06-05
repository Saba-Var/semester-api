import { check } from 'express-validator'

const semesterValidationSchema = check('name')
  .trim()
  .notEmpty()
  .withMessage('Semester name is required')

export default semesterValidationSchema
