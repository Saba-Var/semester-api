import { Weekday, ActivityType, LearningActivity } from 'types.d'
import mongoose, { Schema } from 'mongoose'
import { UserModel } from './types'

const learningActivitySchema: Schema<LearningActivity> = new Schema(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
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
    _id: false,
    versionKey: false,
    timestamps: true,
  }
)

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
    learning_activities: {
      type: [learningActivitySchema],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const User = mongoose.model('user', userSchema)

export default User
