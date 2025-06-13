import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import httpStatus from 'http-status'
import { generateOTP } from '../utils/generateOTP'
import { createToken, verifyToken } from '../utils/authToken'
import { sendEmail } from '../utils/sendEmail'
import { User } from '../models/user.model'
import sendResponse from '../utils/sendResponse'

export const register = catchAsync(async (req, res) => {
  const { name, email, password, phoneNum } = req.body
  if (!name || !email || !password) {
    throw new AppError(httpStatus.FORBIDDEN, 'Please fill in all fields')
  }
  const otp = generateOTP()
  const jwtPayloadOTP = {
    otp: otp,
  }

  const otptoken = createToken(
    jwtPayloadOTP,
    process.env.OTP_SECRET as string,
    process.env.OTP_EXPIRE
  )

  const user = await User.create({
    name,
    email,
    password,
    phoneNum,
    verificationInfo: { token: otptoken },
  })
  await sendEmail(user.email, 'Registerd Account', `Your OTP is ${otp}`)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User Logged in successfully',
    data: user,
  })
})

// export const login = catchAsync(async (req, res) => {
//   const { email, password } = req.body
//   const user = await User.isUserExistsByEmail(email)
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found')
//   }
//   // console.log(await User.isPasswordMatched(password.toString(), user.password))
//   if (
//     user?.password &&
//     !(await User.isPasswordMatched(password, user.password))
//   ) {
//     throw new AppError(httpStatus.FORBIDDEN, 'Password is not correct')
//   }
//   if (!(await User.isOTPVerified(user._id))) {
//     const otp = generateOTP()
//     const jwtPayloadOTP = {
//       otp: otp,
//     }

//     const otptoken = createToken(
//       jwtPayloadOTP,
//       process.env.OTP_SECRET as string,
//       process.env.OTP_EXPIRE
//     )
//     user.verificationInfo.token = otptoken
//     await user.save()
//     await sendEmail(user.email, 'Registerd Account', `Your OTP is ${otp}`)

//     return sendResponse(res, {
//       statusCode: httpStatus.FORBIDDEN,
//       success: false,
//       message: 'OTP is not verified, please verify your OTP',
//       data: { email: user.email },
//     })
//   }
//   const jwtPayload = {
//     _id: user._id,
//     email: user.email,
//     role: user.role,
//   }
//   const accessToken = createToken(
//     jwtPayload,
//     process.env.JWT_ACCESS_SECRET as string,
//     process.env.JWT_ACCESS_EXPIRES_IN as string
//   )

//   const refreshToken = createToken(
//     jwtPayload,
//     process.env.JWT_REFRESH_SECRET as string,
//     process.env.JWT_REFRESH_EXPIRES_IN as string
//   )

//   user.refreshToken = refreshToken
//   let _user = await user.save()

//   res.cookie('refreshToken', refreshToken, {
//     secure: true,
//     httpOnly: true,
//     sameSite: 'none',
//     maxAge: 1000 * 60 * 60 * 24 * 365,
//   })

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'User Logged in successfully',
//     data: {
//       accessToken,
//       refreshToken: refreshToken,
//       role: user.role,
//       _id: user._id,
//     },
//   })
// })


// export const verifyEmail = catchAsync(async (req, res) => {
//   const { email, otp } = req.body
//   const user = await User.isUserExistsByEmail(email)
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found')
//   }
//   if (user.verificationInfo.verified) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User already verified')
//   }
//   if (otp) {
//     const savedOTP = verifyToken(
//       user.verificationInfo.token,
//       process.env.OTP_SECRET || ''
//     ) as JwtPayload
//     console.log(savedOTP)
//     if (otp === savedOTP.otp) {
//       user.verificationInfo.verified = true
//       user.verificationInfo.token = ''
//       await user.save()

//       sendResponse(res, {
//         statusCode: httpStatus.OK,
//         success: true,
//         message: 'User verified',
//         data: '',
//       })
//     } else {
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP')
//     }
//   } else {
//     throw new AppError(httpStatus.BAD_REQUEST, 'OTP is required')
//   }
// })