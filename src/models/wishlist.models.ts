import mongoose, { Schema } from 'mongoose'
import { IWishlist } from '../interface/wishlist.interface'

const WishlistSchema = new Schema<IWishlist>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
  },
  { timestamps: true }
)

export const Wishlist = mongoose.model<IWishlist>('Wishlist', WishlistSchema)
