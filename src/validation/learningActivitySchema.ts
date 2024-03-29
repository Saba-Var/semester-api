import { check, ValidationChain } from 'express-validator'
import { weekdays, activityTypes } from 'data'
import { mongo } from 'mongoose'

export const learningActivitySchema: ValidationChain[] = [
  check('subjectName')
    .trim()
    .notEmpty()
    .withMessage('subject_name_is_required')
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage('subject_name_length'),

  check('teacherName')
    .trim()
    .notEmpty()
    .withMessage('teacher_name_is_required')
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage('teacher_name_length'),

  check('weekday')
    .trim()
    .notEmpty()
    .withMessage('week_day_is_required')
    .isIn(weekdays)
    .withMessage('allowed_week_days'),

  check('activityType')
    .trim()
    .notEmpty()
    .withMessage('activity_type_is_required')
    .isIn(activityTypes)
    .withMessage('allowed_activity_type'),

  check('semester').custom((value) => {
    if (!mongo.ObjectId.isValid(value)) {
      throw new Error('provide_valid_mongoDB_id')
    } else {
      return true
    }
  }),

  check('startingTime')
    .trim()
    .notEmpty()
    .withMessage('starting_time_is_required')
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage('starting_time_length')
    .matches(/^(0[9]|1\d|2[0-3]):(00|30)$/)
    .withMessage('starting_time_format')
    .custom((value, { req }) => {
      const startingValues = value.split(':')
      const startingHour = Number(startingValues[0])
      const startingMinutes = Number(startingValues[1])

      const endingValues = req.body.endingTime.split(':')
      const endingHour = Number(endingValues[0])
      const endingMinutes = Number(endingValues[1])

      if (startingHour === 23 && startingMinutes !== 0) {
        throw new Error('starting_time_minute_when_hour_is_23')
      }

      if (
        startingHour > endingHour ||
        (startingHour === endingHour && startingMinutes >= endingMinutes)
      ) {
        throw new Error('starting_time_should_be_before_ending_time')
      }

      return true
    }),

  check('endingTime')
    .trim()
    .notEmpty()
    .withMessage('ending_time_is_required')
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage('ending_time_length')
    .matches(/^(?:0[9]|1[0-9]|2[0-3]):(?:30|00)$/)
    .withMessage('ending_time_format')
    .custom((value, { req }) => {
      const [endingHour, endingMinute] = value.split(':').map(Number)
      const [startingHour, startingMinute] = req.body.startingTime
        .split(':')
        .map(Number)

      if (
        endingHour < startingHour ||
        (endingHour === startingHour && endingMinute <= startingMinute)
      ) {
        throw new Error('ending_time_should_be_after_starting_time')
      }

      return true
    }),
]
