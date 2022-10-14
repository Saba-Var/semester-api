import { check } from 'express-validator'

const passwordSchema = (minLength = 1) => {
  return check('password')
    .isLength({
      min: minLength,
    })
    .withMessage(
      minLength !== 1
        ? 'Password should include at least 6 characters'
        : 'Password is Required'
    )
}

export default passwordSchema
