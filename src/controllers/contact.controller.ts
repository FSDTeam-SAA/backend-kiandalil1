import catchAsync from '../utils/catchAsync'
import httpStatus from 'http-status'
import AppError from '../errors/AppError'
import sendResponse from '../utils/sendResponse'
import { Contact } from '../models/contact.model'
import { sendEmail } from '../utils/sendEmail'
import { User } from '../models/user.model'

export const createContactMessage = catchAsync(async (req, res) => {
  const { firstName, lastName, address, phoneNum, subject, message, email } = req.body

  if ( !email || !subject || !message) {
    throw new AppError(httpStatus.BAD_REQUEST, 'All fields are required')
  }

  const contact = await Contact.create({
    firstName,
    lastName,
    address,
    phoneNum,
    subject,
    message,
    email,
  })

  // Find all admin users
  const adminUsers = await User.find({ role: 'admin' }).select('email')

  if (!adminUsers.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No admin users found to notify')
  }

  const fullMessage = `
    <h3>New Contact Message</h3>
    <p><strong>Name:</strong> ${firstName} ${lastName}</p>
    <p><strong>Address:</strong> ${address}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phoneNum}</p>
    <p><strong>Subject:</strong> ${subject}</p>
    <p><strong>Message:</strong><br/> ${message}</p>
  `

  // Send email to all admin users
  for (const admin of adminUsers) {
    await sendEmail(admin.email, `New Contact Message: ${subject}`, fullMessage)
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Message sent successfully',
    data: contact,
  })
})
