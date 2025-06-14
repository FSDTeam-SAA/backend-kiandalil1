import mongoose, { Schema } from 'mongoose'
import { IReview } from '../interface/review.interface'

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
    comment: { type: String, required: true },
    rate: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
)

export const Review = mongoose.model<IReview>('Review', ReviewSchema)
