import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { Review } from '../models/review.model'

// Create Review
export const createReview = catchAsync(async (req: Request, res: Response) => {
  const { comment, rate } = req.body
  const userId = req.user?._id

  if (!comment || !rate) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required')
  }

  const review = await Review.create({ userId, comment, rate })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review created successfully',
    data: review,
  })
})

// Get All Reviews
export const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const reviews = await Review.find().populate('userId', 'name email')

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews fetched successfully',
    data: reviews,
  })
})

// Update Review
export const updateReview = catchAsync(async (req: Request, res: Response) => {
  const { comment, rate } = req.body
  const { id } = req.params
  const userId = req.user?._id

  const review = await Review.findOne({ _id: id, userId })

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found or unauthorized')
  }

  if (comment) review.comment = comment
  if (rate) review.rate = rate

  await review.save()

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: review,
  })
})

// Delete Review
export const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const userId = req.user?._id

  const review = await Review.findOneAndDelete({ _id: id, userId })

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found or unauthorized')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: {},
  })
})
