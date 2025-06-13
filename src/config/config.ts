import dotenv from 'dotenv'

dotenv.config()

export default {
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || 10,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  nodeMailer: {
    APP_USER: process.env.APP_USER,
    APP_PASS: process.env.APP_PASS,
  },
}
