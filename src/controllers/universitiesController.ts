import type { Response, NextFunction, Request } from 'express'
import { type IUniversityModel, University } from 'models'
import type { RequestBody, RequestQuery } from 'types'

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
  req: RequestQuery<{ page: string; limit: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 10

    const skip = (page - 1) * limit

    const totalItems = await University.countDocuments()
    const totalPages = Math.ceil(totalItems / limit)

    const universities = await University.find().skip(skip).limit(limit)

    const paginationInfo = {
      currentPage: page,
      totalPages,
      totalItems,
      limit,
    }

    return res.status(200).json({ universities, paginationInfo })
  } catch (error: any) {
    return next(error)
  }
}
