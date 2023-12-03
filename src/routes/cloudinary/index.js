const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const CloudinaryController = require('../../controllers/cloudinary.controller.js')
const { asyncHandler } = require('../../helpers')

router.post('/upload', asyncHandler(CloudinaryController.upload))

// Authentication
router.use(authenticationV2)
////////////////////////////////


module.exports = router