import express from 'express'
import { isAdmin, protect } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/multer.middleware'
import { createNews, getAllNews } from '../controllers/news.controller'


const router = express.Router()

router.get('/news', getAllNews)
router.post('/news', protect,isAdmin, upload.single('image'), createNews)
router.patch('/news/:id', protect, )
router.delete('/review/:id', )

export default router
