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

    lastActive: {
      type: Date,
      default: null,
    },

    userUniversityInfo: {
      type: {
        currentUniversity: {
          universityId: {
            type: Schema.Types.ObjectId,
            ref: 'university',
          },
          selectedDate: {
            type: Date,
          },
          _id: false,
        },
        allUniversities: [
          {
            university: {
              type: Schema.Types.ObjectId,
              ref: 'university',
            },
            selectedDate: {
              type: Date,
            },
            _id: false,
          },
        ],
        ratedUniversities: [
          {
            university: {
              type: Schema.Types.ObjectId,
              ref: 'university',
            },
            ratedDate: {
              type: Date,
            },
            _id: false,
          },
        ],
      },
      default: {
        currentUniversity: {
          universityId: null,
          selectedDate: null,
        },
        allUniversities: [],
        selectedDate: null,
        ratedUniversities: [],
      },
      _id: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default userSchema
