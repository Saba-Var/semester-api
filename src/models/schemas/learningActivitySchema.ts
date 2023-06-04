import { Weekday, ActivityType, LearningActivity } from 'types.d'
import { Schema } from 'mongoose'

const learningActivitySchema: Schema<LearningActivity> = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    subjectName: {
      type: String,
      required: true,
    },
    teacherName: {
      type: String,
      required: true,
    },
    weekday: {
      type: String,
      enum: Object.values(Weekday),
      required: true,
    },
    activityType: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    startingTime: {
      type: String,
      required: true,
    },
    endingTime: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    _id: false,
    versionKey: false,
    timestamps: true,
  }
)

export default learningActivitySchema
