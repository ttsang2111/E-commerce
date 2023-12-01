'use strict'

const { convertStringToMongoDbObject } = require('../../utils')
const { cart } = require('../cart.model')

const findCartById = async (cartId) => {
    return await cart.findOne({_id: convertStringToMongoDbObject(cartId), cart_state: 'active'}).lean()
}

module.exports = {
    findCartById
}