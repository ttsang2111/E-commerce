const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const ProductController = require('../../controllers/product.controller.js')
const { asyncHandler } = require('../../helpers/index.js')

router.get('', asyncHandler(ProductController.getAllProducts))
router.get('/:id', asyncHandler(ProductController.getProduct))
router.get('/search/:keySearch', asyncHandler(ProductController.getProductsByUser))

// Authentication
router.use(authenticationV2)

router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:productId', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unpublishProductByShop))
// Query
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftForShop))
router.get('/published/all', asyncHandler(ProductController.getAllPublishedForShop))
router.get('/unpublished/all', asyncHandler(ProductController.getAllUnpublishedForShop))

module.exports = router