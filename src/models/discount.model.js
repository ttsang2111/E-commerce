'use strict'

const { model, Schema, Types} = require('mongoose')

const DOCUMENT_NAME = 'Discount'
const COLLECTION_NAME = 'discounts'

const discountSChema = new Schema({
    // general
    discount_name: {type: String, required: true},
    discount_description: {type: String, required: true},
    discount_type: {type: String, default: 'fixed_amount'}, // percentage, fixed_amount
    discount_value: {type: Number, required: true}, // 10%, 10,000VND...
    discount_max_value: {type: Number, required: true},
    discount_code: {type: String, required: true},
    discount_start_date: {type: Date, required: true}, 
    discount_end_date: {type: Date, required: true},

    discount_max_use: {type: Number, required: true},
    discount_used_count:{type: Number, required: true},
    discount_used_users: {type: Array, default: []},
    discount_max_use_per_user: {type: Number, required: true},
    discount_min_order_value: {type: Number, required: true},
    
    discount_is_active: {type: Boolean, required: true, default: false},
    discount_applies_to: {type: String, required: true, enum: ['all', 'specific']},
    discount_product_ids: {type: Array, default: []},
    discount_shopId: {type: Types.ObjectId, required: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, discountSChema)