import { createUniversity } from 'controllers'
import { isAdmin } from 'middlewares'
import express from 'express'

const router = express.Router()

router.post('/', isAdmin, createUniversity)

export default router
