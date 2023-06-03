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

    const user = await User.findById(currentUserId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    await User.findByIdAndUpdate(currentUserId, {
      $push: {
        learning_activities: {
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

export const deleteLearningActivity = async (
  req: RequestParams<{ id: string }>,
  res: Response
) => {
  try {
    const { currentUserId } = req
    const { id } = req.params

    const user = await User.findById(currentUserId)

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    const learningActivity = user.learning_activities.find(
      (activity) => activity._id.toString() === id
    )

    if (!learningActivity) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    await User.findByIdAndUpdate(currentUserId, {
      $pull: { learning_activities: { _id: id } },
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
    const { currentUserId } = req
    const { id } = req.params
    const {
      activity_type,
      ending_time,
      starting_time,
      subject_name,
      teacher_name,
      weekday,
    } = req.body

    const currentUser = await User.findById(currentUserId)

    if (!currentUser) {
      return res.status(404).json({
        message: 'User not found',
      })
    }

    if (currentUser.learning_activities?.length === 0) {
      return res.status(404).json({
        message: 'Learning activity not found',
      })
    }

    const learningActivity = currentUser.learning_activities?.find(
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
          'learning_activities.$[elem].activity_type': activity_type,
          'learning_activities.$[elem].ending_time': ending_time,
          'learning_activities.$[elem].starting_time': starting_time,
          'learning_activities.$[elem].subject_name': subject_name,
          'learning_activities.$[elem].teacher_name': teacher_name,
          'learning_activities.$[elem].weekday': weekday,
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
