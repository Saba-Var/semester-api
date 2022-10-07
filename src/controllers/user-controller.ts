import { RequestBody, Response } from 'types.d'
import { NewUserReqBody } from './types'
// import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { User } from 'models'

export const registerUser = async (
  req: RequestBody<NewUserReqBody>,
  res: Response
) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({ message: 'User is already registered!' })
    }

    // const emailToken = jwt.sign({ email, username }, process.env.JWT_SECRET!)

    const hashedPassword = await bcrypt.hash(password, 12)
    await User.create({ username, email, password: hashedPassword })

    return res.status(201).json({
      message: 'User registered successfully!',
    })
  } catch (error: any) {
    return res.status(500).json({ message: error.message })
  }
}
