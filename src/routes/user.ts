import { registerUser, userAccountActivation } from 'controllers'
import { validateRequestSchema } from 'middlewares'
import { userSchema } from 'schemas'
import express from 'express'

const router = express.Router()

router.post('/user', userSchema, validateRequestSchema, registerUser)

router.put('/account', userAccountActivation)

export default router
