import { Types } from "mongoose"

export interface IReview {
  userId: Types.ObjectId
  propertyId: Types.ObjectId
  comment: string
  rate: number // Should ideally be 1-5
}
  