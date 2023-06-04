import { query } from 'express-validator'

const accessTokenSchema = query('accessToken')
  .trim()
  .notEmpty()
  .withMessage('JWT is required')

export default accessTokenSchema
