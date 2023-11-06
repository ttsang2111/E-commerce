const express = require('express')
const router = express.Router()
const { authentication, authenticationV2 } = require('../../auth/middlewares.auth.js')
const ProductController = require('../../controllers/product.controller.js')
const { asyncHandler } = require('../../helpers/index.js')

// authentication
router.use(authenticationV2)

router.post('', asyncHandler(ProductController.createProduct))

module.exports = router