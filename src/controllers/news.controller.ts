// controllers/news.controller.ts
import { Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { News } from '../models/news.model'
import { uploadToCloudinary } from '../utils/cloudinary'
import fs from 'fs'
import { getPaginationParams, buildMetaPagination } from '../utils/pagination'

// Create news

export const createNews = catchAsync(async (req: Request, res: Response) => {
  const { title, subTitle, description } = req.body

  if (!title || !description) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Title and description are required'
    )
  }

  const file = (req.file || (req.files && (req.files as Express.Multer.File[])[0])) as Express.Multer.File
  if (!file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'An image is required')
  }

  const uploadedImage = await uploadToCloudinary(file.path)
  const uploadedImages = uploadedImage ? [uploadedImage] : []

  const imageUrls = uploadedImages
    .filter((res) => res !== null)
    .map((res) => res!.secure_url)

  const news = await News.create({
    title,
    subTitle,
    description,
    images: imageUrls,
  })

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'News created successfully',
    data: news,
  })
})

// Get All News
export const getAllNews = catchAsync(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPaginationParams(req.query)

  const totalItems = await News.countDocuments()
  const totalPages = Math.ceil(totalItems / limit)

  const news = await News.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  const meta = buildMetaPagination(totalItems, page, limit)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'News fetched successfully',
    data: news,
    meta,
  })
})

// Get Single News
export const getSingleNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const news = await News.findById(id)

  if (!news) {
    throw new AppError(httpStatus.NOT_FOUND, 'News not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'News fetched successfully',
    data: news,
  })
})

// Update News
// export const updateNews = catchAsync(async (req: Request, res: Response) => {
//   const { id } = req.params
//   const { title, subTitle, description } = req.body || {}
//   const files = req.files as Express.Multer.File[]

//   const updatePayload: Partial<{
//     title: string
//     subTitle: string
//     description: string
//     images: string[]
//   }> = {}

//   if (title) updatePayload.title = title
//   if (subTitle) updatePayload.subTitle = subTitle
//   if (description) updatePayload.description = description
//   if (files && files.length > 0) {
//     updatePayload.images = files.map((file) => file.path)
//   }

//   const updatedNews = await News.findByIdAndUpdate(id, updatePayload, {
//     new: true,
//   })

//   if (!updatedNews) {
//     throw new AppError(httpStatus.NOT_FOUND, 'News not found')
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'News updated successfully',
//     data: updatedNews,
//   })
// })

export const updateNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, subTitle, description } = req.body || {}
  const files = req.files as Express.Multer.File[]

  const updatePayload: Partial<{
    title: string
    subTitle: string
    description: string
    images: string[]
  }> = {}

  // Handle text fields
  if (title !== undefined) updatePayload.title = title
  if (subTitle !== undefined) updatePayload.subTitle = subTitle
  if (description !== undefined) updatePayload.description = description

  // Handle file uploads
  if (files && files.length > 0) {
    // Upload images to Cloudinary (similar to your property controller)
    const cloudinaryResults = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.path)
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path) // Clean up temp file
        }
        return result
      })
    )

    const imageUrls = cloudinaryResults
      .filter((r) => r !== null)
      .map((r) => (r as { secure_url: string }).secure_url)

    if (imageUrls.length === 0) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Image upload failed'
      )
    }

    updatePayload.images = imageUrls
  }

  const updatedNews = await News.findByIdAndUpdate(id, updatePayload, {
    new: true,
  })

  if (!updatedNews) {
    throw new AppError(httpStatus.NOT_FOUND, 'News not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'News updated successfully',
    data: updatedNews,
  })
})

// Delete News
export const deleteNews = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params

  const deleted = await News.findByIdAndDelete(id)
  if (!deleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'News not found')
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'News deleted successfully',
    data: {},
  })
})
