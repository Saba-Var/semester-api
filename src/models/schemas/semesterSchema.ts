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
      ref: 'user',
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: false,
      default: null,
    },

    isCurrentSemester: {
      type: Boolean,
      required: false,
    },

    learningActivities: [
      {
        type: Schema.Types.ObjectId,
        ref: 'learningActivity',
        default: [],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

semesterSchema.index({ name: 1, user: 1 }, { unique: true })

export default semesterSchema
