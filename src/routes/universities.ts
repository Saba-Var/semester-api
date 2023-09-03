import { createUniversity, getUniversities } from 'controllers'
import { isAdmin } from 'middlewares'
import express from 'express'

const router = express.Router()

router.post('/', isAdmin, createUniversity)

router.get('/', getUniversities)

export default router
