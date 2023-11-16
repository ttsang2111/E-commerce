'use strict'

const { Schema, Types, model } = require('mongoose')
const DOCUMENT_NAME = 'Inventory'
const COLLECTION_NAME = 'Inventories'

const inventoryShema = new Schema({
    inven_stock: {type: Number, required: true},
    inven_location: {type: String, default: 'unknown'},
    inven_shopId: {type: Types.ObjectId, ref: 'Shop'},
    inven_productId: {type: Types.ObjectId, ref: 'Product'},
    inven_reservations: {type: Array, default: []}

}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

module.exports = {
    inventory: model(DOCUMENT_NAME, inventoryShema)}