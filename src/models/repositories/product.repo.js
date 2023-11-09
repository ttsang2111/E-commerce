'use strict'

const { product, clothing, electronic } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectedData, getUnSelectedData } = require('../../utils/index')

const findProduct = async ({id, unSelect}) => {
    const foundProduct = await product.findOne({
        _id: id
    }).select(getUnSelectedData(unSelect))

    return foundProduct
}

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

const searchProductsByUser = async ({ keySearch }) => {
    const regexSearch = new RegExp(keySearch)
    const results = await product.find({
        $text: {
            $search: regexSearch
        }
    }, {
        score: { $meta: 'textScore' }
    })
        .sort()
        .lean()
    return results
}

const searchAllProducts = async ({ sort, page, limit, filter, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const foundProducts = await product
        .find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .select(getSelectedData(select))
        .lean()
    return foundProducts
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
    unpublishProductByShop,
    searchProductsByUser,
    searchAllProducts,
    findProduct
}