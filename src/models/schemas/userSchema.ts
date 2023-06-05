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
    password: { type: String },
    image: {
      type: String,
    },
    semesters: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Semester',
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default userSchema
