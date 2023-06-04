import { Weekday, ActivityType, LearningActivityModel } from 'types.d'
import { Schema } from 'mongoose'

const learningActivitySchema: Schema<LearningActivityModel> = new Schema(
  {
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
      immutable: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default learningActivitySchema
