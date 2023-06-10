import type { UserModel } from 'models'
import { Schema } from 'mongoose'

const userSchema: Schema<UserModel> = new Schema(
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
      type: String,
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
