import { Weekday, ActivityType, LearningActivity } from 'types.d'
import { Schema } from 'mongoose'

export const learningActivitySchema: Schema<LearningActivity> = new Schema(
  {
    subject_name: {
      type: String,
      required: true,
    },
    teacher_name: {
      type: String,
      required: true,
    },
    weekday: {
      type: String,
      enum: Object.values(Weekday),
      required: true,
    },
    activity_type: {
      type: String,
      enum: Object.values(ActivityType),
      required: true,
    },
    starting_time: {
      type: String,
      required: true,
    },
    ending_time: {
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
    versionKey: false,
    timestamps: true,
  }
)
