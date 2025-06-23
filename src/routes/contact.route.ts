import express from 'express'
import { createContactMessage } from '../controllers/contact.controller'

const router = express.Router()

router.post('/contact', createContactMessage)

export default router
