import { type IUniversityEvaluationModel } from 'models'
import { evaluationCriterias } from 'data'
import { Schema } from 'mongoose'

const criteriaTypes = evaluationCriterias.reduce(
  (acc, criteria) => ({
    ...acc,
    [criteria]: {
      type: Number,
      required: true,
    },
  }),
  {}
)

const universityEvaluationSchema = new Schema<IUniversityEvaluationModel>(
  {
    criterias: criteriaTypes,

    university: {
      type: Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    averageScore: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    totalScore: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universityEvaluationSchema
