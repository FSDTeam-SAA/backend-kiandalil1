import mongoose, { Schema } from 'mongoose'
import { INews } from '../interface/news.model'

const newsSchema = new Schema<INews>(
  {
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String },
    images: [{ type: String, required: true }],
  },

  { timestamps: true }
)

export const News = mongoose.model<INews>('News', newsSchema)
