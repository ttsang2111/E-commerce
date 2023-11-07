'use strict'

const { product, clothing, electronic } = require('../product.model')
const { Types } = require('mongoose')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, {
        isDraft: false,
        isPublished: true
    })
    return foundProduct
}

const unpublishProductByShop = async ({ product_shop, product_id }) => {
    const foundProduct = await product.findOneAndUpdate({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    }, {
        isDraft: true,
        isPublished: false
    })
    return foundProduct
}


const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unpublishProductByShop
}