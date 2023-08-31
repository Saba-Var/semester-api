import type { IUserModel } from 'models'
import { Schema } from 'mongoose'

const userSchema: Schema<IUserModel> = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: false,
    },

    role: {
      default: 'user',
      type: String,
      immutable: true,
    },

    activeSemester: {
      type: Schema.Types.ObjectId || null,
      ref: 'semester',
      default: null,
    },

    password: { type: String },

    image: {
      default: null,
      type: Object || null,
      collectionName: String,
    },

    semesters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'semester',
      },
    ],

    userUniversityInfo: {
      type: {
        currentUniversity: {
          type: Schema.Types.ObjectId,
          ref: 'university',
        },
        allUniversities: {
          type: [Schema.Types.ObjectId],
          ref: 'university',
        },
        selectedDate: {
          type: Date,
        },
        ratedUniversities: [
          {
            type: Schema.Types.ObjectId,
            ref: 'university',
          },
        ],
      },
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default userSchema
