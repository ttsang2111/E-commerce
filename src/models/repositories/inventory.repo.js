'use strict'

const { convertStringToMongoDbObject } = require('../../utils')
const inventory = require('../inventory.model')


const insertInventory = async ({ stock, shopId, productId, location = 'unknown' }) => {
    return await inventory.create({
        inven_location: location,
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock
    })
}

const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertStringToMongoDbObject(productId),
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }
    return await inventory.updateOne(query, updateSet, options)
}

module.exports = {
    insertInventory,
    reservationInventory
}