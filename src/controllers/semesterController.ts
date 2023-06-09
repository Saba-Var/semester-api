import type { RequestBody, ExtendedAuthRequest, RequestParams } from 'types'
import type { Response } from 'express'
import { Semester, User } from 'models'

export const createSemester = async (
  req: RequestBody<{ name: string }>,
  res: Response
) => {
  try {
    const { name } = req.body

    const semesterExists = await Semester.findOne({
      user: req?.currentUser?.id,
      name,
    })

    if (semesterExists) {
      return res
        .status(409)
        .json({ message: `Semester with name '${name}' already exists` })
    }

    const newSemester = await Semester.create({
      user: req?.currentUser?.id,
      name,
    })

    await User.findByIdAndUpdate(req?.currentUser?.id, {
      $push: { semesters: newSemester._id },
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
    }).select('_id name')

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