import express from 'express'
import {
  addToWishlist,
  getUserWishlist,
  removeFromWishlist,
} from '../controllers/wishlist.controller'
import { protect } from '../middlewares/auth.middleware'
const router = express.Router()

router.post('/add-wishlist', protect, addToWishlist)
router.get('/my-wishlist', protect, getUserWishlist)
router.delete('/remove/:wishListId', protect, removeFromWishlist)

export default  router
