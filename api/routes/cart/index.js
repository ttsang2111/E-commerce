const express = require('express')
const router = express.Router()
const CartController = require('../../controllers/cart.controller.js')
const { asyncHandler } = require('../../helpers/index.js')

router.post('', asyncHandler(CartController.addToCart))
router.delete('', asyncHandler(CartController.delete))
router.post('/update', asyncHandler(CartController.update))
router.get('', asyncHandler(CartController.listToCart))

module.exports = router