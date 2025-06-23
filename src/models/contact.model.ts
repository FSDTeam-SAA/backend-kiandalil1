import { Schema, model } from 'mongoose'

const contactSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String,  },
    phoneNum: { type: String,  },
    subject: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

export const Contact = model('Contact', contactSchema)
