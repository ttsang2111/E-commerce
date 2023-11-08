'use strict'

const slugify = require('slugify')
const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    product_name: {type: String, required: true}, // Iphone XS
    product_slug: String, // iphone-xs
    product_thumb: {type: String, required: true},
    product_description: String,
    product_price: {type: Number, required: true},
    product_quantity: {type: Number, required: true},
    product_type: {type: String, required: true, enum: ['Electronic', 'Clothing']},
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed, require: true},
    product_variations: {type: Array, default: []},
    product_ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be below 5']
    },
    isPublished: {type: Boolean, default: false, index: true, select: false},
    isDraft: {type: Boolean, default: true, index: true, select: false}
}, {
    collection: COLLECTION_NAME,
    timestamp: true
})

productSchema.index({ product_name: 'text', product_description: 'text' })

productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
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