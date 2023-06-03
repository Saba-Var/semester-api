import { validateRequestSchema } from 'middlewares'
import { getUserDetails } from 'controllers'
import { optionalParamId } from 'schemas'
import express from 'express'

const router = express.Router()

router.get('/:id?', optionalParamId, validateRequestSchema, getUserDetails)

export default router
