// routes/news.route.ts
import express from 'express'
import { isAdmin, protect } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/multer.middleware'
import {
  createNews,
  getAllNews,
  getSingleNews,
  updateNews,
  deleteNews,
} from '../controllers/news.controller'

const router = express.Router()

router.get('/news', getAllNews)
router.get('/news/:id', getSingleNews)
router.post('/news', protect, isAdmin, upload.array('images'), createNews)
router.patch('/news/:id', protect, isAdmin, upload.array('images'), updateNews)
router.delete('/news/:id', protect, isAdmin, deleteNews)

export default router
