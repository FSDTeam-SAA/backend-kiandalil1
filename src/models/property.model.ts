import mongoose, { Schema } from 'mongoose'
import { IProperty } from '../interface/property.interface';

const PropertySchema = new Schema<IProperty>(
  {
    images: [{ type: String, required: true }],
    title: { type: String, required: true },
    subtitle: { type: String },
    type: {  type: String },
    description: { type: String },
    features: [{ type: String }],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approve: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Property = mongoose.model<IProperty>('Property', PropertySchema)
