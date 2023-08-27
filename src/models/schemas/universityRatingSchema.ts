import { IUniversityRatingModel } from 'models'
import { Schema } from 'mongoose'

const criterias = [
  'qualityOfEducation',
  'employability',
  'classSize',
  'researchOpportunities',
  'facilities',
  'studentLife',
  'supportServices',
  'location',
  'diversityAndInclusion',
  'internshipAndJobs',
  'socialResponsibility',
  'alumniSuccess',
  'affordability',
  'buffet',
  'staffEducation',
  'library',
  'techEquipment',
]

export const criteriaTypes = criterias.reduce(
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
    scores: criteriaTypes,
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

export default universityRatingSchema
