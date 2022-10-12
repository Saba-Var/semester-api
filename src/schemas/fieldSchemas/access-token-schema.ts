import { check } from 'express-validator'

const accessTokenSchema = check('accessToken')
  .trim()
  .exists()
  .notEmpty()
  .withMessage('JWT is required')

export default accessTokenSchema
