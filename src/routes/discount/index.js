const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const DiscountController = require('../../controllers/discount.controller.js')
const { asyncHandler } = require('../../helpers/index.js')


router.get('/list_products_by_code', asyncHandler(DiscountController.getAllProductsByDiscountCode))

// Authentication
router.use(authenticationV2)

router.get('/all', asyncHandler(DiscountController.getAllDiscountsByShop))
router.post('', asyncHandler(DiscountController.createDiscount))
router.patch('', asyncHandler(DiscountController.updateDiscount))

module.exports = router