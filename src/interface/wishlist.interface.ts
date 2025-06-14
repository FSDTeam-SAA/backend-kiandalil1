import { Types } from "mongoose"

export interface IWishlist {
  userId: Types.ObjectId
  propertyId: Types.ObjectId
}
  