import express from 'express'
import {
  createProperty,
  updateProperty,
  deleteProperty,
  getSingleProperty,
  changeApprovalStatus,
  getUnapprovedProperties,
  getApprovedProperties,
  getPropertiesByUserId,
  getApprovedPropertiesByCity,
} from '../controllers/property.controller'
import { protect } from '../middlewares/auth.middleware'
import { isAdmin } from '../middlewares/auth.middleware'
import { upload } from '../middlewares/multer.middleware'
const router = express.Router()

router.post('/properties', protect, upload.array('images'), createProperty)
router.get('/properties/:id', getSingleProperty)
router.patch('/properties/:id', protect, updateProperty)
router.delete('/properties/:id', protect, deleteProperty)
router.patch('/properties/approve/:id', protect, isAdmin, changeApprovalStatus)
router.get(
  '/properties/unapproved/all',
  protect,
  isAdmin,
  getUnapprovedProperties
)

router.get

router.get('/properties/user/:userId', protect, getPropertiesByUserId)
router.get('/properties/approved/all', getApprovedProperties)

// get property citys
router.get('/all/properties/citys', getApprovedPropertiesByCity)

export default router
