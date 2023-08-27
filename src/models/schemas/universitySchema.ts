import { IUniversityModel } from 'models'
import { Schema } from 'mongoose'

const universitySchema = new Schema<IUniversityModel>(
  {
    name: {
      type: String,
      required: true,
      immutable: true,
    },
    image: {
      type: String,
      required: true,
    },
    overallRating: {
      type: Number,
      required: true,
      default: null,
    },
    ratings: [
      {
        type: Schema.Types.ObjectId,
        ref: 'universityRating',
        default: [],
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universitySchema
