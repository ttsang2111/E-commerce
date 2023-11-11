'use strict'

const discount = require('../discount.model')
const { convertStringToMongoDbObject, getSelectedData, getUnSelectedData } = require('../../utils/index.js')

const findDiscountsSelect = async ({ filter, sort, page, limit, select }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const foundDiscounts = await discount
        .find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .select(getSelectedData(select))
        .lean()
    return foundDiscounts
}

const findDiscountsUnselect = async ({ filter, sort, page, limit, unselect }) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? {_id: -1} : {_id: 1}
    const foundDiscounts = await discount
        .find(filter)
        .sort(sortBy)
        .limit(limit)
        .skip(skip)
        .select(getUnSelectedData(unselect))
        .lean()
    return foundDiscounts
}

const findOneByCodeAndShopId = async ({code, shopId}) => {
    return await discount.findOne({
        discount_code: code,
        discount_shopId: convertStringToMongoDbObject(shopId)
    }).lean()
}

const updateDiscountByCodeAndShopId = async ({code, shopId}, bodyUpdate, isNew=true) => {
    return await discount.findOneAndUpdate({
        discount_code: code,
        discount_shopId: convertStringToMongoDbObject(shopId)
    }, bodyUpdate, {new: isNew})
}

module.exports = {
    findDiscountsSelect,
    findDiscountsUnselect,
    findOneByCodeAndShopId,
    updateDiscountByCodeAndShopId
}