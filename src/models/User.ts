import { userSchema } from './schemas'
import mongoose from 'mongoose'

const User = mongoose.model('user', userSchema)

export default User
