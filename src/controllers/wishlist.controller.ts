import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { Wishlist } from '../models/wishlist.models'

// Add to wishlist
export const addToWishlist = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id
  const { propertyId } = req.body

  if (!propertyId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Property ID is required')
  }

  const exists = await Wishlist.findOne({ userId, propertyId })
  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'Already in wishlist')
  }

  const wishlist = await Wishlist.create({ userId, propertyId })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Added to wishlist',
    data: wishlist,
  })
})

// Get wishlist for user
export const getUserWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id

    const wishlist = await Wishlist.find({ userId }).populate('propertyId')

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Wishlist fetched',
      data: wishlist,
    })
  }
)

// Remove from wishlist
export const removeFromWishlist = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id
   
    const { wishListId } = req.params

    const removed = await Wishlist.findByIdAndDelete(wishListId)
    if (!removed) {
      throw new AppError(httpStatus.NOT_FOUND, 'Item not found in wishlist')
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Removed from wishlist',
      data: {},
    })
  }
)
