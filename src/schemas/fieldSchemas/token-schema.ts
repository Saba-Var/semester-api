import { check } from 'express-validator'

const tokenSchema = [
  check('token').trim().exists().withMessage('JWT is required'),
]

export default tokenSchema
