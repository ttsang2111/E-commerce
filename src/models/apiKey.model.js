'use strict'

const { model, Schema} = require('mongoose')

const DOCUMENT_NAME = 'ApiKey'
const COLLECTION_NAME = 'ApiKeys'

const apiKeySChema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: false
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['000', '001', '002']
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, apiKeySChema)