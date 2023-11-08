const express = require('express')
const router = express.Router()
const { authentication, authenticationV2 } = require('../../auth/middlewares.auth.js')
const ProductController = require('../../controllers/product.controller.js')
const { asyncHandler } = require('../../helpers/index.js')


// Authentication
router.use(authenticationV2)

router.post('', asyncHandler(ProductController.createProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unpublishProductByShop))

// Query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishedForShop))
router.get('/unpublished/all', asyncHandler(ProductController.getAllUnpublishedForShop))

module.exports = router