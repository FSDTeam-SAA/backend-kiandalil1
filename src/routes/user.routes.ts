import express from 'express'
import {
  register,
  verifyEmail,
  login,
  forgetPassword,
  resetPassword,
  changePassword,
  allUser,
  singleUser,
  userprofileUpgrade,
} from '../controllers/user.controller'
import { protect } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/multer.middleware'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verifyEmail)
router.post('/forget', forgetPassword),
router.post('/reset-password', resetPassword)
router.post('/change-password', protect, changePassword)

// get all user
router.get('/all/user', allUser)
router.get('/user/:id', singleUser)
router.patch('/profile/update/:id', upload.single('avatar'), userprofileUpgrade)

export default router
