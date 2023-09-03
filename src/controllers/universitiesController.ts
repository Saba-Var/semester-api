import { type IUniversityModel, University } from 'models'
import type { RequestBody, RequestQuery } from 'types'
import type { Response, NextFunction } from 'express'
import { paginate } from 'utils'

export const createUniversity = async (
  req: RequestBody<IUniversityModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.currentUser?.role !== 'admin') {
      return res.status(401).json({
        message: req.t('user_is_not_authorized_to_continue'),
      })
    }

    const { name, logoSrc, ratings } = req.body

    const existingUniversity = await University.findOne({
      name,
    })

    if (existingUniversity) {
      return res.status(409).json({
        message: req.t('university_already_exists'),
      })
    }

    const criteriaRatingValues = Object.values(ratings.criterias)

    const averageRating =
      criteriaRatingValues.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      ) / criteriaRatingValues.length

    const newUniversity = await University.create({
      averageRating,
      ratings,
      logoSrc,
      name,
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
  req: RequestQuery<{ page: number; limit: number }>,
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
