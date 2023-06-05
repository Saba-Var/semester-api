import type { SemesterModel } from 'models'
import { Schema } from 'mongoose'

const semesterSchema: Schema<SemesterModel> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    learningActivities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'LearningActivity',
        default: [],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default semesterSchema
