import { evaluationCriterias } from 'data'
import { check } from 'express-validator'

export const universityEvaluationValidation = evaluationCriterias.map(
  (criteria) =>
    check(criteria)
      .isNumeric()
      .withMessage('evaluation_criteria_must_be_a_number')
      .isInt({ min: 0, max: 10 })
      .withMessage('evaluation_criteria_range')
)
