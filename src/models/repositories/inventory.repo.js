'use strict'

const inventory = require('../inventory.model')
const { Types } = require('mongoose')

const insertInventory = async ({ stock, shopId, productId, location = 'unknown' }) => {
    return await inventory.create({
        inven_location: location,
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock
    })
}

module.exports = {
    insertInventory
}