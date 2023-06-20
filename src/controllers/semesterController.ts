import { Semester, User, SemesterModel } from 'models'
import type { Response } from 'express'
import type {
  ExtendedAuthRequest,
  RequestParams,
  RequestBody,
  AuthRequest,
} from 'types'
import { generateFieldError } from 'utils'

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
        .json(
          generateFieldError(
            'name',
            req.t('semester_with_name_already_exists', { name })
          )
        )
    }

    const currentUser = await User.findById(req?.currentUser?.id)

    if (currentUser?.activeSemester) {
      return res.status(409).json({
        message: req.t('you_already_have_active_semester_warning'),
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

    return res
      .status(201)
      .json({ message: req.t('semester_created_successfully') })
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
    const semester = await Semester.findOne({
      _id: req.params.id,
      user: req.currentUser?.id,
    })
      .populate('learningActivities')
      .select('-user -createdAt')

    if (!semester) {
      return res.status(404).json({
        message: req.t('semester_not_found'),
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
        message: req.t('semester_not_found'),
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
      message: req.t('semester_deleted_successfully'),
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
        message: req.t('semester_not_found'),
      })
    }

    if (semester.endDate) {
      return res.status(400).json({
        message: req.t('semester_already_ended'),
      })
    }

    if (semester.startDate > endDate) {
      return res
        .status(422)
        .json(
          generateFieldError(
            'endDate',
            req.t('end_date_cannot_be_before_start_date')
          )
        )
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
      message: req.t('semester_ended_successfully'),
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
        message: req.t('semester_not_found'),
      })
    }

    const semesterExists = await Semester.findOne({
      user: req?.currentUser?.id,
      name,
      _id: { $ne: req.params.id },
    })

    if (semesterExists) {
      return res
        .status(409)
        .json(
          generateFieldError(
            'name',
            req.t('semester_with_name_already_exists', { name })
          )
        )
    }

    if (!semester.isCurrentSemester) {
      return res.status(400).json({
        message: req.t('semester_is_not_active_to_edit'),
      })
    }

    semester.name = name
    semester.startDate = startDate
    await semester.save()

    return res.status(200).json({
      message: req.t('semester_updated_successfully'),
    })
  } catch (error: any) {
    return res.status(500).json({
      message: error?.message,
    })
  }
}
