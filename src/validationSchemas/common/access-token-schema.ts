import { query } from 'express-validator'

const accessTokenSchema = query('accessToken')
  .trim()
  .notEmpty()
  .withMessage('jwt_is_required')

export default accessTokenSchema
