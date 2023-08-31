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

    const university = await University.create(req.body)

    return res.status(201).json(university)
  } catch (error) {
    return next(error)
  }
}
