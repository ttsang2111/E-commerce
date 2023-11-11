'use strict'

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Cart'
const COLLECTION_NAME = 'carts'

const cartSChema = new Schema({
    cart_state: {
        type: String, required: true,
        enum: ['active', 'completed', 'failed', 'pending'],
        default: 'active',
    },
    cart_products: {type: Array, required: true, default: []},
    /*
        [
            {
                productId,
                shopId,
                quantity,
                name,
                price
            }
        ]
    */
   cart_count_product: {type: Number, default: 0},
   cart_userId: {type: Number, required: true}
}, {
    collection: COLLECTION_NAME,
    timeseries: {
        createAt: 'createOn',
        updateAt: 'modfiedOn'
    }
})

module.exports = {
    cart: model(DOCUMENT_NAME, cartSChema)
}