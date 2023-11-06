'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {type: String, required: true},
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronic', 'Clothing']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, require: true}
}, {
    collection: COLLECTION_NAME,
    timestamp: true
})

const electronicSchema = new Schema({
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    manifacturer: {type: String, required: true},
    model: String,
    color: String
}, {
    collection: 'Electronics',
    timestamp: true
})

const clothingSchema = new Schema({
    brand: {type: String, required: true},
    size: String,
    material: String

},  {
    collection: 'Clothings',
    timestamp: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    electronic: model('Electronic', electronicSchema),
    clothing: model('Clothing', clothingSchema)
}