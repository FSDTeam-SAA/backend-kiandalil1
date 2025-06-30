import { Schema, model } from 'mongoose'

const contactSchema = new Schema(
  {
    firstName: { type: String, },
    lastName: { type: String, },
    address: { type: String,  },
    phoneNum: { type: String,  },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

export const Contact = model('Contact', contactSchema)
