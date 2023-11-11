const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const DiscountController = require('../../controllers/discount.controller.js')
const { asyncHandler } = require('../../helpers/index.js')



// Authentication
router.use(authenticationV2)
router.get('/all', asyncHandler(DiscountController.getAllDiscounts))
router.get('/:code', asyncHandler(DiscountController.getAllProductsByDiscountCode))
router.post('', asyncHandler(DiscountController.createDiscount))
router.patch('', asyncHandler(DiscountController.updateDiscount))

module.exports = router