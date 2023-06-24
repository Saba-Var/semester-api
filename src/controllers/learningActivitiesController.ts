import type { Response, NextFunction } from 'express'
import { LearningActivity, Semester } from 'models'
import type {
  LearningActivityModel,
  RequestParams,
  RequestBody,
  AuthRequest,
} from 'types'

export const createLearningActivity = async (
  req: RequestBody<LearningActivityModel>,
  res: Response,
  next: NextFunction
) => {
  try {
    const semester = await Semester.findOne({
      _id: req.body.semester,
      user: req.currentUser?._id,
    })

    if (!semester) {
      return res.status(404).json({
        message: req.t('semester_not_found'),
      })
    }

    const newLearningActivity = await LearningActivity.create({
      ...req.body,
      user: req.currentUser?._id,
    })

    await semester.updateOne({
      $push: {
        learningActivities: newLearningActivity._id,
      },
    })

    return res.status(201).json({
      message: req.t('learning_activity_created_successfully'),
      _id: newLearningActivity._id,
    })
  } catch (error) {
    return next(error)
  }
}

export const getLearningActivity = async (
  req: RequestParams<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const learningActivity = await LearningActivity.findOne({
      user: req.currentUser?._id,
      _id: req.params.id,
    })

    if (!learningActivity) {
      return res.status(404).json({
        message: req.t('learning_activity_not_found'),
      })
    }

    return res.status(200).json(learningActivity)
  } catch (error) {
    return next(error)
  }
}

export const getAllLearningActivityOfSemester = async (
  req: RequestParams<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const learningActivities = await LearningActivity.find({
      user: req.currentUser?._id,
      semester: req.params.id,
    })

    return res.status(200).json(learningActivities)
  } catch (error) {
    return next(error)
  }
}

export const deleteLearningActivity = async (
  req: RequestParams<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const deletedLearningActivity = await LearningActivity.findOneAndDelete({
      user: req.currentUser?._id,
      _id: req.params.id,
    })

    if (!deletedLearningActivity) {
      return res.status(404).json({
        message: req.t('learning_activity_not_found'),
      })
    }

    await Semester.findOneAndUpdate(
      { _id: deletedLearningActivity.semester },
      {
        $pull: {
          learningActivities: deletedLearningActivity._id,
        },
      }
    )

    return res.status(200).json({
      message: req.t('learning_activity_deleted_successfully'),
      _id: deletedLearningActivity._id,
    })
  } catch (error) {
    return next(error)
  }
}

export const updateLearningActivity = async (
  req: AuthRequest<LearningActivityModel, { id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedLearningActivity = await LearningActivity.findOneAndUpdate(
      { _id: req.params.id, user: req.currentUser?._id },
      req.body
    )

    if (!updatedLearningActivity) {
      return res.status(404).json({
        message: req.t('learning_activity_not_found'),
      })
    }

    return res.status(200).json({
      message: req.t('learning_activity_updated_successfully'),
    })
  } catch (error) {
    return next(error)
  }
}
