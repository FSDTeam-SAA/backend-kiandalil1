import { Request, Response } from 'express'
import httpStatus from 'http-status'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { Property } from '../models/property.model'
import { uploadToCloudinary } from '../utils/cloudinary'
import fs from 'fs'
import { getPaginationParams, buildMetaPagination } from '../utils/pagination'

// Get All Properties
export const getAllProperties = catchAsync(
  async (req: Request, res: Response) => {
    const properties = await Property.find().populate('userId', 'name email')
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      data: properties,
    })
  }
)

// create a property
export const createProperty = catchAsync(
  async (req: Request, res: Response) => {
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
      price,
      address,
      offMarket,
      whatsappNum,
      phoneNum,
    } = req.body

    const userId = req.user?._id
    const files = req.files as Express.Multer.File[]

    console.log('first,', userId)

    if (!files || files.length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'At least one image is required'
      )
    }

    // Upload images to Cloudinary
    const cloudinaryResults = await Promise.all(
      files.map(async (file) => {
        const result = await uploadToCloudinary(file.path)
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path)
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

    // Parse and filter quality fields
    let quality = {}
    if (req.body.quality) {
      try {
        const parsedQuality = JSON.parse(req.body.quality)
        quality = {
          ...(parsedQuality.propertyType && {
            propertyType: parsedQuality.propertyType,
          }),
          ...(parsedQuality.houseType && {
            houseType: parsedQuality.houseType,
          }),
          ...(parsedQuality.bed && { bed: parsedQuality.bed }),
          ...(parsedQuality.bath && { bath: parsedQuality.bath }),
          ...(parsedQuality.sqrFt && { sqrFt: parsedQuality.sqrFt }),
        }
      } catch (err) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid JSON in quality field'
        )
      }
    }

    const newProperty = await Property.create({
      title,
      subtitle,
      type,
      description,
      features: features ? JSON.parse(features) : [],
      userId,
      images: imageUrls,
      country,
      state,
      price,
      city,
      zipCode,
      address,
      quality,
      offMarket,
      whatsappNum,
      phoneNum,
    })

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Property created successfully',
      data: newProperty,
    })
  }
)

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
export const getUnapprovedProperties = catchAsync(
  async (req: Request, res: Response) => {
    const { page, limit, skip } = getPaginationParams(req.query)

    const totalItems = await Property.countDocuments({ approve: false })

    const totalPages = Math.ceil(totalItems / limit)

    const unapprovedProperties = await Property.find({ approve: false })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const meta = buildMetaPagination(totalItems, page, limit)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Unapproved properties fetched',
      data: unapprovedProperties,
      meta,
    })
  }
)

export const getApprovedProperties = catchAsync(
  async (req: Request, res: Response) => {
    const {
      search,
      minPrice,
      maxPrice,
      type,
      country,
      state,
      city,
      offMarket,
    } = req.query
    const { page, limit, skip } = getPaginationParams(req.query)

    const filter: any = { approve: true }

    // Price range filtering
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Search across multiple fields
    if (search) {
      const searchRegex = new RegExp(search as string, 'i')
      filter.$or = [
        { title: searchRegex },
        { type: searchRegex },
        { features: searchRegex },
        { country: searchRegex },
        { state: searchRegex },
        { city: searchRegex },
      ]
    }

    // Exact match filters
    if (type) filter.type = type
    if (country) filter.country = country
    if (state) filter.state = state
    if (city) filter.city = city

    if (offMarket !== undefined) {
      filter.offMarket = offMarket === 'true'
    }

    const totalItems = await Property.countDocuments(filter)
    const totalPages = Math.ceil(totalItems / limit)

    const properties = await Property.find(filter)
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const meta = buildMetaPagination(totalItems, page, limit)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Approved properties fetched',
      data: properties,
      meta,
    })
  }
)

// property.controller.ts
export const getPropertiesByUserId = catchAsync(
  async (req: Request, res: Response) => {
    const { userId } = req.params
    const { page, limit, skip } = getPaginationParams(req.query)

    const totalItems = await Property.countDocuments({ userId })
    const totalPages = Math.ceil(totalItems / limit)

    const properties = await Property.find({ userId })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email')

    const meta = buildMetaPagination(totalItems, page, limit)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Properties fetched successfully',
      data: properties,
      meta,
    })
  }
)

export const getApprovedPropertiesByCity = catchAsync(
  async (req: Request, res: Response) => {
    try {
      const cities = await Property.distinct('city')
      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Cities fetched successfully',
        data: cities,
      })
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'name' in err &&
        (err as any).name === 'CastError'
      ) {
        sendResponse(res, {
          statusCode: httpStatus.BAD_REQUEST,
          success: false,
          message: 'Invalid Cast error',
          data: {},
        })
      } else {
        throw err
      }
    }
  }
)
