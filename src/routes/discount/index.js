const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const DiscountController = require('../../controllers/discount.controller.js')
const { asyncHandler } = require('../../helpers/index.js')


router.get('/code_to_products', asyncHandler(DiscountController.getAllProductsWithDiscountCode))
router.get('/product_to_codes', asyncHandler(DiscountController.getAllDiscountsByProduct))
router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))

// Authentication
router.use(authenticationV2)

router.get('/all', asyncHandler(DiscountController.getAllDiscounts))
router.post('', asyncHandler(DiscountController.createDiscount))
router.patch('', asyncHandler(DiscountController.updateDiscount)) 

module.exports = router