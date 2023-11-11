'use strict'

const discount = require('../discount.model')
const { convertStringToMongoDbObject } = require('../../utils/index.js')

const findAllSelectedDiscounts = async ({ sort, page, limit, filter, select }) => {
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
