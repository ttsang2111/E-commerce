'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Order'
const COLLECTION_NAME = 'orders'

const orderSchema = new Schema({
    order_userId: {type: Number, required: true},
    order_checkout: {type: Object, default: {}},
    /*
    order_checkout = {
        totalPrice,
        totalAppliedDiscount,
        feeShip
    }
    */
   order_shipping: {type: Object, default: {}},
   /*
   street,
   city,
   state,
   country
   */
    order_payment: {type: Object, default: {}},
    order_products: {type: Array, required: true},
    order_trackingNumber: { type: String, default: '#0000114112023'},
    order_status: {type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending'}
})

module.exports = {
    order: model(DOCUMENT_NAME, orderSchema)
}