'use strict';

const { model, Schema } = require('mongoose');

const DOCUMENT_NAME = "Comment";
const COLLECTION_NAME = "Comments";

const commentSchema = new Schema({
    comment_productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    comment_userId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    comment_content: { type: String, default: 'text', required: true },
    comment_left: { type: Number, default: 0, required: true }, 
    comment_right: { type: Number, default: 0, required: true },
    comment_parentId: { type: Schema.Types.ObjectId, ref: DOCUMENT_NAME, required: true },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model( DOCUMENT_NAME, commentSchema );