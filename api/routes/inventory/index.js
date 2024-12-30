const express = require('express')
const router = express.Router()
const InventoryController = require('../../controllers/inventory.controller.js')
const { asyncHandler } = require('../../helpers/index.js')
const { authenticationV2 } = require('../../auth/middlewares.auth.js')

router.use(authenticationV2)
router.post('/', asyncHandler(InventoryController.addStockToInventory))

module.exports = router