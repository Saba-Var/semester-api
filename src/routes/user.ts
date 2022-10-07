import { validateRequestSchema } from 'middlewares'
import { registerUser } from 'controllers'
import { userSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.post('/user', userSchema, validateRequestSchema, registerUser)

export default router
