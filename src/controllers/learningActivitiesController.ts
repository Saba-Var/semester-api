import { LearningActivity } from 'models'
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
    const newLearningActivity = await LearningActivity.create({
      ...req.body,
      user: req.currentUser?.id,
    })

    return res.status(201).json({
      message: 'New learning activity created successfully!',
      newLearningActivity,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const getUserLearningActivities = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const userLearningActivities = await LearningActivity.find({
      user: req.currentUser?.id,
    })

    return res.status(200).json(userLearningActivities)
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

    return res.status(200).json({
      message: 'Learning activity deleted successfully',
      deletedLearningActivity,
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
      updatedLearningActivity,
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
