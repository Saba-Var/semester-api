import { evaluationCriterias } from 'data'
import { IUniversityModel } from 'models'
import { Schema } from 'mongoose'

const criteriaTypes = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: {
      type: Number,
      default: null,
      min: 0,
      max: 10,
    },
  }),
  {}
)

const universitySchema = new Schema<IUniversityModel>(
  {
    name: {
      type: {
        en: String,
        ka: String,
      },
      required: true,
      immutable: true,
      unique: true,
    },
    logoSrc: {
      type: String,
      required: true,
      unique: true,
    },
    averageRating: {
      type: Number,
      required: true,
      default: null,
    },
    alias: {
      type: String,
      required: true,
      unique: true,
    },
    ratings: criteriaTypes,
    voteCount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universitySchema
