import { type IUniversityModel, University } from 'models'
import type { Response, NextFunction } from 'express'
import type { RequestBody } from 'types'

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

    const criteriaRatingValues = Object.values(ratings)

    const overallRating =
      criteriaRatingValues.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      ) / criteriaRatingValues.length

    const newUniversity = await University.create({
      overallRating,
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
