import { check, ValidationChain } from 'express-validator'
import { Weekday, ActivityType } from 'types.d'

const newLearningActivitySchema: ValidationChain[] = [
  check('subjectName')
    .trim()
    .notEmpty()
    .withMessage('Subject name is required')
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage('Subject name should include at least 3 & max.100 characters'),

  check('teacherName')
    .trim()
    .notEmpty()
    .withMessage('Teacher name is required')
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage('Teacher name should include at least 3 & max.30 characters'),

  check('weekday')
    .trim()
    .notEmpty()
    .withMessage('Weekday is required')
    .isIn(Object.values(Weekday))
    .withMessage(
      'Weekday should be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday'
    ),

  check('activityType')
    .trim()
    .notEmpty()
    .withMessage('Activity type is required')
    .isIn(Object.values(ActivityType))
    .withMessage(
      'Activity type should be one of the following: Lecture, Seminar, Laboratory, Project, Exam, Other'
    ),

  check('startingTime')
    .trim()
    .notEmpty()
    .withMessage('Starting time is required')
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage('Starting time should include 5 characters')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Starting time should be in this format: 09:00')
    .custom((value, { req }) => {
      const startingValues = value.split(':')
      const startingHour = Number(startingValues[0])
      const startingMinutes = Number(startingValues[1])

      const endingValues = req.body.endingTime.split(':')
      const endingHour = Number(endingValues[0])
      const endingMinutes = Number(endingValues[1])

      if (startingHour < 9 || startingHour > 23) {
        throw new Error('Starting time should be between 09:00 and 23:00')
      }

      if (startingMinutes !== 0 && startingMinutes !== 30) {
        throw new Error('Starting time minutes should be either 00 or 30')
      }

      if (startingHour === 23 && startingMinutes !== 0) {
        throw new Error('Starting time minutes should be 00 if hours is 23')
      }

      if (
        startingHour > endingHour ||
        (startingHour === endingHour && startingMinutes >= endingMinutes)
      ) {
        throw new Error('Starting time should be before ending time')
      }

      return true
    }),

  check('endingTime')
    .trim()
    .notEmpty()
    .withMessage('Ending time is required')
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage('Ending time should include 5 characters')
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage(
      'Ending time should be in this format: 09:00.  Minutes should be either 00 or 30. Minimum hour is 09:00 and maximum hour is 23:30'
    )
    .custom((value, { req }) => {
      const [endingHour, endingMinute] = value.split(':').map(Number)
      const [startingHour, startingMinute] = req.body.startingTime
        .split(':')
        .map(Number)

      if (
        endingHour < 9 ||
        endingHour > 23 ||
        (endingHour === 23 && endingMinute > 30)
      ) {
        throw new Error('Ending time should be between 09:00 and 23:30')
      }

      if (endingMinute % 30 !== 0) {
        throw new Error('Ending time minutes should be either 00 or 30')
      }

      if (
        endingHour < startingHour ||
        (endingHour === startingHour && endingMinute <= startingMinute)
      ) {
        throw new Error('Ending time should be after starting time')
      }

      return true
    }),
]

export default newLearningActivitySchema
