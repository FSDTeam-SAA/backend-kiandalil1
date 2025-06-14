import express from 'express'

import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', register)


export default router
