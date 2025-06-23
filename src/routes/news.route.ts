import express from 'express'
import { isAdmin, protect } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/multer.middleware'
import {
  createNews,
  getAllNews,
  deleteNews,
  updateNews,
} from '../controllers/news.controller'

const router = express.Router()

router.get('/news', getAllNews)
router.post('/news', protect, isAdmin, upload.single('image'), createNews)
router.patch('/news/:id', protect, isAdmin, upload.array('images'), updateNews)
router.delete('/news/:id', protect, isAdmin, deleteNews)

export default router
