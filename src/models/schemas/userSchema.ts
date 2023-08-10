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

    activeSemester: {
      type: Schema.Types.ObjectId || null,
      ref: 'semester',
      default: null,
    },

    password: { type: String },

    image: {
      default: null,
      type: Object || null,
    },

    semesters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'semester',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default userSchema
