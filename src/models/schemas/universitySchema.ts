import { evaluationCriterias } from 'data'
import { IUniversityModel } from 'models'
import { Schema } from 'mongoose'

const criteriaTypes = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: {
      averageScore: {
        type: Number,
        default: null,
        min: 0,
      },

      totalScore: {
        type: Number,
        default: 0,
        min: 0,
      },

      _id: false,
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
      _id: false,
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
    code: {
      type: String,
      required: true,
      unique: true,
    },
    evaluation: {
      type: Object,
      required: true,

      criterias: criteriaTypes,

      voteCount: {
        type: Number,
        required: true,
        default: 0,
      },

      users: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: 'User',
          },
        ],
        required: true,
        default: [],
      },
    },
    website: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universitySchema
