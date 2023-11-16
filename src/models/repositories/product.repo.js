'use strict'

const { product, clothing, electronic } = require('../product.model')
const { Types } = require('mongoose')
const { getSelectedData, getUnSelectedData, convertStringToMongoDbObject } = require('../../utils/index')

const updateProductById = async ({
    product_id, 
    bodyUpdate, 
    model,
    isNew=true
}) => {
    return await model.findOneAndUpdate(product_id, bodyUpdate, {new: isNew})
}

const findProductSelect = async ({id, select}) => {
    const foundProduct = await product.findOne({
        _id: id
    }).select(getSelectedData(select))

    return foundProduct
}

const findProductUnselect = async ({id, unselect}) => {
    const foundProduct = await product.findOne({
        _id: id
    }).select(getUnSelectedData(unselect))

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

const findProductsByUser = async ({ keySearch }) => {
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

const findProductsSelect = async ({ page, limit, filter, select, sort }) => {
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

const getProductById = async (productId) => {
    return await product.findOne({ _id: convertStringToMongoDbObject(productId) }).lean()
}

const checkProductByServer = async (products) => {
    return await Promise.all( products.map( async product => {
        const foundProduct = await getProductById(product.productId)
        if(foundProduct) {
            return {
                price: product.product_price,
                quantity: product.product_quantity,
                productId: foundProduct._id
            }
        }
    }))
}

module.exports = {
    findAllDraftsForShop,
    findAllPublishedForShop,
    publishProductByShop,
    unpublishProductByShop,
    searchProductsByUser: findProductsByUser,
    searchAllProducts: findProductsSelect,
    findProduct: findProductUnselect,
    findProductSelect,
    updateProductById,
    getProductById,
    checkProductByServer
}