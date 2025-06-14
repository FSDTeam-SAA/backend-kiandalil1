import express from 'express'
import {
  createReview,
  deleteReview,
  getAllReviews,
  updateReview,
} from '../controllers/review.controller'
import { isAdmin, protect } from '../middlewares/auth.middleware'

const router = express.Router()

router.get('/reviews', getAllReviews)
router.post('/review', protect, createReview)
router.patch('/review/:id', protect, updateReview)
router.delete('/review/:id', protect, isAdmin, deleteReview)

export default router
