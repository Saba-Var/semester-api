import { Semester, User, SemesterModel } from 'models'
import type { Response } from 'express'
import type {
  ExtendedAuthRequest,
  RequestParams,
  RequestBody,
  AuthRequest,
} from 'types'

export const createSemester = async (
  req: RequestBody<SemesterModel>,
  res: Response
) => {
  try {
    const { name, startDate } = req.body

    const semesterExists = await Semester.findOne({
      user: req?.currentUser?.id,
      name,
    })

    if (semesterExists) {
      return res
        .status(409)
        .json({ message: `Semester with name '${name}' already exists` })
    }

    const currentUser = await User.findById(req?.currentUser?.id)

    if (currentUser?.activeSemester) {
      return res.status(409).json({
        message:
          'You already have an active semester! End it and create a new one.',
      })
    }

    await Semester.updateMany(
      { user: req?.currentUser?.id },
      { isCurrentSemester: false }
    )

    const newSemester = await Semester.create({
      user: req?.currentUser?.id,
      isCurrentSemester: true,
      startDate,
      name,
    })

    await User.findByIdAndUpdate(req?.currentUser?.id, {
      $push: { semesters: newSemester._id },
      $set: { activeSemester: newSemester._id },
    })

    return res.status(201).json({ message: 'Semester created' })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const getSemesters = async (req: ExtendedAuthRequest, res: Response) => {
  try {
    const semesters = await Semester.find({
      user: req?.currentUser?.id,
    }).select('-user')

    return res.status(200).json(semesters)
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}

export const getSemesterData = async (
  req: RequestParams<{ id: string }>,
  res: Response
) => {
  try {
    const semester = await Semester.find({
      _id: req.params.id,
      user: req.currentUser?.id,
    })
      .populate('learningActivities')
      .select('-user -createdAt')

    if (!semester) {
      return res.status(404).json({
        message: 'Semester not found',
      })
    }

    return res.status(200).json(semester)
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message,
    })
  }
}

export const deleteSemester = async (
  req: RequestParams<{ id: string }>,
  res: Response
) => {
  try {
    const deletedSemester = await Semester.findOneAndDelete({
      _id: req.params.id,
      user: req.currentUser?.id,
    })

    if (!deletedSemester) {
      return res.status(404).json({
        message: 'Semester not found',
      })
    }

    const currentUser = await User.findById(req.currentUser?.id)

    await User.findByIdAndUpdate(req.currentUser?.id, {
      $pull: { semesters: deletedSemester._id },
      $set: {
        activeSemester:
          currentUser?.activeSemester?.toString() ===
          deletedSemester._id.toString()
            ? null
            : currentUser?.activeSemester,
      },
    })

    return res.status(200).json({
      message: 'Semester deleted successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message,
    })
  }
}

export const endSemester = async (
  req: AuthRequest<{ endDate: Date }, { id: string }>,
  res: Response
) => {
  try {
    const { endDate } = req.body
    const { currentUser } = req

    const semester = await Semester.findById(req.params.id)

    if (!semester) {
      return res.status(404).json({
        message: 'Semester not found',
      })
    }

    if (semester.endDate) {
      return res.status(400).json({
        message: 'Semester already ended',
      })
    }

    if (semester.startDate > endDate) {
      return res.status(400).json({
        message: 'End date cannot be before start date',
      })
    }

    semester.endDate = endDate
    semester.isCurrentSemester = false
    await semester.save()

    await User.findOneAndUpdate(
      {
        _id: currentUser?.id,
        activeSemester: req.params.id,
      },
      {
        $set: { activeSemester: null },
      }
    )

    return res.status(200).json({
      message: 'Semester ended successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message,
    })
  }
}

export const updateSemester = async (
  req: AuthRequest<{ name: string; startDate: Date }, { id: string }>,
  res: Response
) => {
  try {
    const { name, startDate } = req.body

    const semester = await Semester.findById(req.params.id)

    if (!semester) {
      return res.status(404).json({
        message: 'Semester not found',
      })
    }

    const semesterExists = await Semester.findOne({
      user: req?.currentUser?.id,
      name,
    })

    if (semesterExists) {
      return res.status(409).json({
        message: `Semester with name '${name}' already exists`,
      })
    }

    if (!semester.isCurrentSemester) {
      return res.status(400).json({
        message: "Semester is not active. You can't edit semester!",
      })
    }

    semester.name = name
    semester.startDate = startDate
    await semester.save()

    return res.status(200).json({
      message: 'Semester updated successfully',
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message,
    })
  }
}
