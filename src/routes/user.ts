import { getUserDetails } from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails)

export default router
