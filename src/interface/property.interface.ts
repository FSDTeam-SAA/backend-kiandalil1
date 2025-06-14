import { Types } from "mongoose"


export interface IProperty {
  images: string[]
  title: string
  subtitle: string
  description: string
  features: string[] 
  userId: Types.ObjectId 
  approve: boolean
}
  