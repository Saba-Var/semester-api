import { getUserDetails, updateUserDetails } from 'controllers'
import express from 'express'

const router = express.Router()

router.get('/', getUserDetails)

router.put('/', updateUserDetails)

export default router
