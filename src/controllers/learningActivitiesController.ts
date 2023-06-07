import { LearningActivity, Semester } from 'models'
import { Response } from 'express'
import type {
  LearningActivityModel,
  ExtendedAuthRequest,
  RequestParams,
  RequestBody,
  AuthRequest,
} from 'types'

export const createLearningActivity = async (
  req: RequestBody<LearningActivityModel>,
  res: Response
) => {
  try {
    const semester = await Semester.findOne({
      _id: req.body.semester,
      user: req.currentUser?.id,
    })

    if (!semester) {
      return res.status(404).json({
        message: 'Semester not found',
      })
    }

    const newLearningActivity = await LearningActivity.create({
      ...req.body,
      user: req.currentUser?.id,
    })

    await semester.updateOne({
      $push: {
        learningActivities: newLearningActivity._id,
      },
    })

    return res.status(201).json({
      message: 'New learning activity created successfully!',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getLearningActivity = async (
  req: RequestParams<{ id: string }>,
  res: Response
) => {
  try {
    const learningActivity = await LearningActivity.findOne({
      user: req.currentUser?.id,
      _id: req.params.id,
    })

    return res.status(200).json(learningActivity)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const deleteLearningActivity = async (
  req: RequestParams<{ id: string }>,
  res: Response
) => {
  try {
    const deletedLearningActivity = await LearningActivity.findOneAndDelete({
      user: req.currentUser?.id,
      _id: req.params.id,
    })

    if (!deletedLearningActivity) {
      return res.status(404).json({
        message: 'Learning activity not found',
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
      message: 'Learning activity deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const updateLearningActivity = async (
  req: AuthRequest<LearningActivityModel, { id: string }>,
  res: Response
) => {
  try {
    const updatedLearningActivity = await LearningActivity.findOneAndUpdate(
      { _id: req.params.id, user: req.currentUser?.id },
      req.body
    )

    if (!updatedLearningActivity) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    return res.status(200).json({
      message: 'Learning activity updated successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
