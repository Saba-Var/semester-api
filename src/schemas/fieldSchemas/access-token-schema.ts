import { query } from 'express-validator'

const accessTokenSchema = query('accessToken')
  .exists()
  .trim()
  .notEmpty()
  .withMessage('JWT is required')

export default accessTokenSchema
