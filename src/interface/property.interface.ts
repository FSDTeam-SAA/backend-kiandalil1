import { Types } from "mongoose"

 interface IQuality {
  propertyType: string,
  houseType: string,
  bed: string,
  bath: string,
  sqrFt: string,
 }

export interface IProperty {
  images: string[]
  title: string
  subtitle: string
  type: string
  description: string
  features: string[]
  userId: Types.ObjectId
  approve: boolean
  country: string
  state: string
  city: string
  zipCode: string
  address: string
  offMarket: boolean
  quality: IQuality
}
  