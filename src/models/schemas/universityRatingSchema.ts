import { IUniversityRatingModel } from 'models'
import { evaluationCriterias } from 'data'
import { Schema } from 'mongoose'

export const criteriaTypes = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
      default: null,
    },
  }),
  {}
)

const universityRatingSchema = new Schema<IUniversityRatingModel>(
  {
    university: {
      type: Schema.Types.ObjectId,
      ref: 'university',
      required: true,
      immutable: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
      immutable: true,
    },
    overallRating: {
      type: Number,
      required: true,
      default: null,
    },
    scores: criteriaTypes,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universityRatingSchema
