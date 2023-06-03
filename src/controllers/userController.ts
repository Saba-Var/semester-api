import type { RequestBody, ExtendedAuthRequest, LearningActivity } from 'types'
import { Response } from 'express'
import { User } from 'models'

export const getUserDetails = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.currentUserId).select(
      '-password -verified -active'
    )

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    return res.status(200).json(user)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}

export const createLearningActivity = async (
  req: RequestBody<LearningActivity>,
  res: Response
) => {
  try {
    const { currentUserId } = req

    const learningActivity = {
      ...req.body,
      user: currentUserId,
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: { learning_activities: learningActivity },
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

export const getUserLearningActivities = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const { currentUserId } = req

    const user = await User.findById(currentUserId).populate(
      'learning_activities'
    )

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json(user.learning_activities)
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}