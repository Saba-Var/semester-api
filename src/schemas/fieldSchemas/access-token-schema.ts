import { check } from 'express-validator'

const accessTokenSchema = check('accessToken')
  .trim()
  .exists()
  .withMessage('JWT is required')

export default accessTokenSchema
