import type { UniversityRatingsRequestData } from './types'
import { type IUniversityModel, University } from 'models'
import type { Response, NextFunction } from 'express'
import { updateCriterias } from 'services'
import { evaluationCriterias } from 'data'
import { paginate } from 'utils'
import mongoose from 'mongoose'
import type {
  PaginationBaseQuery,
  RequestParams,
  RequestQuery,
  RequestBody,
  AuthRequest,
  Id,
} from 'types'

export const createUniversity = async (
  req: RequestBody<IUniversityModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, evaluation } = req.body

    const existingUniversity = await University.findOne({
      name,
    })

    if (existingUniversity) {
      return res.status(409).json({
        message: req.t('university_already_exists'),
      })
    }

    const criteriaRatingValues = Object.values(evaluation.criterias)

    const averageRating =
      criteriaRatingValues.reduce((acc, currentValue) => {
        if (!currentValue.averageScore) return acc

        return acc + currentValue.averageScore
      }, 0) / criteriaRatingValues.length

    const newUniversity = await University.create({
      ...req.body,
      averageRating,
    })

    return res.status(201).json({
      message: req.t('university_created_successfully'),
      _id: newUniversity._id,
    })
  } catch (error) {
    return next(error)
  }
}

export const getUniversities = async (
  req: RequestQuery<PaginationBaseQuery>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data, paginationInfo } = await paginate({
      model: University,
      query: req.query,
    })

    return res.status(200).json({ data, paginationInfo })
  } catch (error: any) {
    return next(error)
  }
}

export const getUniversityData = async (
  req: RequestParams<Id>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params

    const university = await University.findById(id)

    if (!university) {
      return res.status(404).json({
        message: req.t('university_not_found'),
      })
    }

    return res.status(200).json(university)
  } catch (error: any) {
    return next(error)
  }
}

export const rateUniversity = async (
  req: AuthRequest<UniversityRatingsRequestData, Id>,
  res: Response,
  next: NextFunction
) => {
  try {
    const university = await University.findById(req.params.id)
    if (!university) {
      return res.status(404).json({
        message: req.t('university_not_found'),
      })
    }

    let criteriaTotalScore = 0

    await Promise.all(
      evaluationCriterias.map(async (criteriaName) => {
        const criteriaScore = req.body[criteriaName]
        await updateCriterias(university, criteriaName, criteriaScore)
        criteriaTotalScore += criteriaScore
      })
    )

    await university.updateOne({
      $push: {
        'evaluation.users': new mongoose.Types.ObjectId(req.currentUser?._id),
      },
      $inc: {
        'evaluation.voteCount': 1,
        totalScore: criteriaTotalScore,
      },
      $set: {
        averageRating:
          (university.totalScore + criteriaTotalScore) /
          (university.evaluation.voteCount + 1),
      },
    })

    return res.status(200).json({
      message: req.t('university_rated_successfully'),
      _id: university._id,
    })
  } catch (error: any) {
    return next(error)
  }
}
