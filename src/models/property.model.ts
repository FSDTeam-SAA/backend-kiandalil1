import mongoose, { Schema } from 'mongoose'
import { IProperty } from '../interface/property.interface'

const PropertySchema = new Schema<IProperty>(
  {
    images: [{ type: String, required: true }],
    title: { type: String, required: true },
    subtitle: { type: String },
    type: { type: String },
    description: { type: String },
    features: [{ type: String }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approve: { type: Boolean, default: false },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    zipCode: { type: String },
    address: { type: String },
    offMarket: { type: Boolean, default: true },
    quality: {
      propertyType: { type: String },
      houseType: { type: String },
      bed: { type: String },
      bath: { type: String },
      sqrFt: { type: String },
    },
  },

  { timestamps: true }
)

export const Property = mongoose.model<IProperty>('Property', PropertySchema)
