import { validateRequestSchema } from 'middlewares'
import { getUserDetails } from 'controllers'
import { objectId } from 'schemas'
import express from 'express'

const router = express.Router()

router.get('/:id', objectId, validateRequestSchema, getUserDetails)

export default router
