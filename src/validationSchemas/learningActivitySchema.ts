import { check, ValidationChain } from 'express-validator'
import { Weekday, ActivityType } from 'types.d'
import { mongo } from 'mongoose'

const learningActivitySchema: ValidationChain[] = [
  check('subjectName')
    .trim()
    .notEmpty()
    .withMessage("'subjectName' is required")
    .isLength({
      min: 3,
      max: 100,
    })
    .withMessage(
      "'subjectName' should include at least 3 & max.100 characters"
    ),

  check('teacherName')
    .trim()
    .notEmpty()
    .withMessage("'teacherName' is required")
    .isLength({
      min: 3,
      max: 30,
    })
    .withMessage("'teacherName' should include at least 3 & max.30 characters"),

  check('weekday')
    .trim()
    .notEmpty()
    .withMessage("'weekday' is required")
    .isIn(Object.values(Weekday))
    .withMessage(
      "'weekday' should be one of the following: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday"
    ),

  check('activityType')
    .trim()
    .notEmpty()
    .withMessage("'activityType' type is required")
    .isIn(Object.values(ActivityType))
    .withMessage(
      "'activityType' should be one of the following: Lecture, Seminar, Laboratory, Project, Exam, Other"
    ),

  check('semester').custom((value) => {
    if (!mongo.ObjectId.isValid(value)) {
      throw new Error('Provide a valid mongoDB id.')
    } else {
      return true
    }
  }),

  check('startingTime')
    .trim()
    .notEmpty()
    .withMessage("'startingTime' is required")
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage("'startingTime' should include 5 characters")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("'startingTime' should be in this format: 09:00")
    .custom((value, { req }) => {
      const startingValues = value.split(':')
      const startingHour = Number(startingValues[0])
      const startingMinutes = Number(startingValues[1])

      const endingValues = req.body.endingTime.split(':')
      const endingHour = Number(endingValues[0])
      const endingMinutes = Number(endingValues[1])

      if (startingHour < 9 || startingHour > 23) {
        throw new Error("'startingTime' should be between 09:00 and 23:00")
      }

      if (startingMinutes !== 0 && startingMinutes !== 30) {
        throw new Error("'startingTime' minutes should be either 00 or 30")
      }

      if (startingHour === 23 && startingMinutes !== 0) {
        throw new Error("'startingTime' minutes should be 00 if hours is 23")
      }

      if (
        startingHour > endingHour ||
        (startingHour === endingHour && startingMinutes >= endingMinutes)
      ) {
        throw new Error("'startingTime' should be before ending time")
      }

      return true
    }),

  check('endingTime')
    .trim()
    .notEmpty()
    .withMessage("'endingTime' is required")
    .isLength({
      min: 5,
      max: 5,
    })
    .withMessage("'endingTime' should include 5 characters")
    .matches(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage(
      "'endingTime' should be in this format: 09:00.  Minutes should be either 00 or 30. Minimum hour is 09:00 and maximum hour is 23:30"
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
        throw new Error("'endingTime' should be between 09:00 and 23:30")
      }

      if (endingMinute % 30 !== 0) {
        throw new Error("'endingTime' minutes should be either 00 or 30")
      }

      if (
        endingHour < startingHour ||
        (endingHour === startingHour && endingMinute <= startingMinute)
      ) {
        throw new Error("'endingTime' should be after starting time")
      }

      return true
    }),
]

export default learningActivitySchema
