import type { Response, NextFunction } from 'express'
import { updateCriterias } from 'services'
import { evaluationCriterias } from 'data'
import { paginate } from 'utils'
import mongoose from 'mongoose'
import type {
  UniversityRatingsRequestData,
  PaginationBaseQuery,
  RequestParams,
  RequestQuery,
  RequestBody,
  AuthRequest,
  Id,
} from 'types'
import {
  type IUniversityModel,
  UniversityEvaluation,
  University,
  User,
} from 'models'

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

    const user = await User.findById(req.currentUser?._id)

    const canRateUniversity = user?.userUniversityInfo.allUniversities.some(
      (item) => item.university.toString() === university._id.toString()
    )

    if (!canRateUniversity) {
      return res.status(403).json({
        message: req.t('user_cannot_rate_university', {
          name: university.name[req.cookies.language || 'en'],
        }),
      })
    }

    const previousUniversityEvaluation = await UniversityEvaluation.findOne({
      university: university._id,
      user: req.currentUser?._id,
    })

    const evaluationCriteriasObject: {
      [keyof in typeof evaluationCriterias[number]]?: number
    } = {}

    let criteriaTotalScore = 0

    evaluationCriterias.forEach((criteriaName) => {
      const criteriaValue = req.body[criteriaName]
      evaluationCriteriasObject[criteriaName] = criteriaValue
      criteriaTotalScore += criteriaValue
    })

    const allEvaluations = await UniversityEvaluation.find({
      university: university._id,
    })

    const averageEvaluationRating = allEvaluations.reduce(
      (acc, evaluation) => acc + evaluation.averageScore,
      0
    )

    if (previousUniversityEvaluation) {
      const newTotalScore =
        university.totalScore -
        previousUniversityEvaluation.totalScore +
        criteriaTotalScore

      await university.updateOne({
        $set: {
          averageRating:
            (averageEvaluationRating -
              previousUniversityEvaluation.averageScore +
              criteriaTotalScore / evaluationCriterias.length) /
            allEvaluations.length,
          totalScore: newTotalScore,
        },
      })

      await Promise.all(
        evaluationCriterias.map(async (criteriaName) => {
          const previousCriteriaScore =
            previousUniversityEvaluation.criterias[criteriaName]
          const universityCriteriaInfo =
            university.evaluation.criterias[criteriaName]

          if (req.body[criteriaName] !== previousCriteriaScore) {
            const newTotalScore =
              universityCriteriaInfo.totalScore -
              previousCriteriaScore +
              req.body[criteriaName]

            const newAverageScore = newTotalScore / allEvaluations.length

            await university.updateOne({
              $set: {
                [`evaluation.criterias.${criteriaName}.totalScore`]:
                  newTotalScore,
                [`evaluation.criterias.${criteriaName}.averageScore`]:
                  newAverageScore,
              },
            })
          }
        })
      )

      await previousUniversityEvaluation.updateOne({
        criterias: evaluationCriteriasObject,
        averageScore: criteriaTotalScore / evaluationCriterias.length,
        totalScore: criteriaTotalScore,
      })
    } else {
      await Promise.all(
        evaluationCriterias.map(async (criteriaName) => {
          const criteriaScore = req.body[criteriaName]
          await updateCriterias(university, criteriaName, criteriaScore)
        })
      )

      const newUniversityEvaluation = await UniversityEvaluation.create({
        user: req.currentUser?._id,
        university: university._id,
        criterias: evaluationCriteriasObject,
        averageScore: criteriaTotalScore / evaluationCriterias.length,
        totalScore: criteriaTotalScore,
      })

      await university.updateOne({
        $push: {
          'evaluation.userEvaluations': new mongoose.Types.ObjectId(
            newUniversityEvaluation._id
          ),
        },
        $inc: {
          'evaluation.voteCount': 1,
          totalScore: criteriaTotalScore,
        },
        $set: {
          averageRating:
            (averageEvaluationRating +
              criteriaTotalScore / evaluationCriterias.length) /
            (allEvaluations.length + 1),
        },
      })

      await user?.updateOne({
        $push: {
          'userUniversityInfo.ratedUniversities': {
            university: university._id,
            ratedDate: new Date(),
          },
        },
      })
    }

    return res.status(200).json({
      message: req.t('university_rated_successfully'),
      _id: university._id,
    })
  } catch (error: any) {
    return next(error)
  }
}
