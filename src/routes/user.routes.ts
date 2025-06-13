import express from 'express'
import {
  register,
  verifyEmail,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
} from '../controllers/user.controller'
import { protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verifyEmail)
router.post('/forget', forgetPassword),
router.post('/reset-password', resetPassword)
router.post('/change-password', protect, changePassword)

export default router
