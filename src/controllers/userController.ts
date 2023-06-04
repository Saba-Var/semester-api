import type {
  RequestBody,
  ExtendedAuthRequest,
  LearningActivity,
  RequestParams,
  AuthRequest,
} from 'types'
import { Response } from 'express'
import { User } from 'models'

export const getUserDetails = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const user = await User.findById(req.currentUser?.id).select(
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
    const currentUserId = req.currentUser?.id

    const user = await User.findById(currentUserId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: {
        learningActivities: {
          ...req.body,
          user: currentUserId,
        },
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

export const getUserLearningActivities = async (
  req: ExtendedAuthRequest,
  res: Response
) => {
  try {
    const id = req.currentUser?.id

    const user = await User.findById(id).populate('learningActivities')

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    return res.status(200).json(user.learningActivities)
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
    const currentUserId = req.currentUser?.id
    const { id } = req.params

    const user = await User.findById(currentUserId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const learningActivity = user.learningActivities.find(
      (activity) => activity._id.toString() === id
    )

    if (!learningActivity) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { learningActivities: { _id: id } },
    })

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
  req: AuthRequest<LearningActivity, { id: string }>,
  res: Response
) => {
  try {
    const currentUserId = req.currentUser?.id
    const { id } = req.params
    const {
      activityType,
      endingTime,
      startingTime,
      subjectName,
      teacherName,
      weekday,
    } = req.body

    const currentUser = await User.findById(currentUserId)

    if (!currentUser) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (currentUser.learningActivities?.length === 0) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    const learningActivity = currentUser.learningActivities?.find(
      (activity) => activity._id.toString() === id
    )

    if (!learningActivity) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    await User.findOneAndUpdate(
      currentUser._id,
      {
        $set: {
          'learningActivities.$[elem].activityType': activityType,
          'learningActivities.$[elem].endingTime': endingTime,
          'learningActivities.$[elem].startingTime': startingTime,
          'learningActivities.$[elem].subjectName': subjectName,
          'learningActivities.$[elem].teacherName': teacherName,
          'learningActivities.$[elem].weekday': weekday,
        },
      },
      {
        arrayFilters: [{ 'elem._id': id }],
      }
    )

    return res.status(200).json({
      message: 'Learning activity updated successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    })
  }
}
