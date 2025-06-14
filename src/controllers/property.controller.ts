import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { Property } from '../models/property.model'
import { uploadToCloudinary } from '../utils/cloudinary'


// Create a Property
export const createProperty = catchAsync(async (req: any, res: any) => {
    const {
      title,
      subtitle,
      type,
      description,
      features,
      country,
      state,
      city,
      zipCode,
      address,
    } = req.body
  
    const userId = req.user?._id
    const files = req.files // multer should provide this
  
    if (!files || files.length === 0) {
      throw new AppError(httpStatus.BAD_REQUEST, 'At least one image is required')
    }
  
    // Upload all images to Cloudinary and collect URLs
    const imageUploadPromises = files.map((file: Express.Multer.File) =>
      uploadToCloudinary(file.path)
    )
    const cloudinaryResults = await Promise.all(imageUploadPromises)
    const imageUrls = cloudinaryResults
      .filter((r) => r !== null)
      .map((r) => r.secure_url)
  
    if (imageUrls.length === 0) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Image upload failed')
    }
  
    const newProperty = await Property.create({
      title,
      subtitle,
      type,
      description,
      features,
      userId,
      images: imageUrls,
      country,
      state,
      city,
      zipCode,
      address,
    })
  
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    })
  })

// Update Property
export const updateProperty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const updates = req.body

    const updated = await Property.findOneAndUpdate(
      { _id: id, userId: req.user?._id },
      updates,
      { new: true }
    )

    if (!updated) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Property not found or unauthorized'
      )
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property updated',
      data: updated,
    })
  }
)

// Delete Property
export const deleteProperty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params

    const deleted = await Property.findOneAndDelete({
      _id: id,
      userId: req.user?._id,
    })

    if (!deleted) {
      throw new AppError(
        httpStatus.NOT_FOUND,
        'Property not found or unauthorized'
      )
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property deleted successfully',
      data: deleted,
    })
  }
)

// View Single Property
export const getSingleProperty = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params

    const property = await Property.findById(id).populate(
      'userId',
      'name email'
    )

    if (!property) {
      throw new AppError(httpStatus.NOT_FOUND, 'Property not found')
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Property fetched',
      data: property,
    })
  }
)

// Change Approval Status
export const changeApprovalStatus = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params
    const { approve } = req.body

    const property = await Property.findById(id)

    if (!property) {
      throw new AppError(httpStatus.NOT_FOUND, 'Property not found')
    }

    property.approve = approve
    await property.save()

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: `Property ${approve ? 'approved' : 'disapproved'}`,
      data: property,
    })
  }
)


// Get only unapproved properties (Admin only)
export const getUnapprovedProperties = catchAsync(async (req: Request, res: Response) => {

    const unapprovedProperties = await Property.find({ approve: false }).populate('userId', 'name email')
  
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Unapproved properties fetched',
      data: unapprovedProperties,
    })
  })
  

  export const getApprovedProperties = catchAsync(
    async (req: Request, res: Response) => {
      const unapprovedProperties = await Property.find({
        approve: true,
      }).populate('userId', 'name email')

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Unapproved properties fetched',
        data: unapprovedProperties,
      })
    }
  )
  