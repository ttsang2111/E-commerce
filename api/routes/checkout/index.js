const express = require('express')
const router = express.Router()
const CheckoutController = require('../../controllers/checkout.controller.js')
const { asyncHandler } = require('../../helpers/index.js')

router.post('/review', asyncHandler(CheckoutController.checkoutReview))

module.exports = router