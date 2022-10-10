import { check } from 'express-validator'

const passwordSchema = (minLength?: number) => {
  return  check('password')
      .isLength({
        min: minLength ? minLength : 0,
      })
      .withMessage(
        minLength
          ? 'Password should include at least 6 characters'
          : 'Password is required'
      ),
   
}

export default passwordSchema
