import express from 'express'
import { register, verifyEmail } from '../controllers/user.controller'

const router = express.Router()

router.post('/register', register);
// router.post('/login', login);
router.post('/verify', verifyEmail)


export default router
