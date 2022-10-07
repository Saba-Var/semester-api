import { registerUser } from 'controllers'
import express from 'express'

const router = express.Router()

router.post('/user', registerUser)

export default router
