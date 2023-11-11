'use strict'

const { BadRequestError } = require("../core/error.response")
const { validateDiscountInput } = require("../helpers/validate.input")
const { convertStringToMongoDbObject, removeUndefinedObject } = require("../utils")
const discount = require("../models/discount.model")
const { findOneByCodeAndShopId, updateDiscountByCodeAndShopId, findDiscountsSelect, findDiscountsUnselect } = require("../models/repositories/discount.repo")
const { searchAllProducts: findAllProducts } = require('../models/repositories/product.repo')

class DiscountService {
    static createDiscount = async (payload) => {
        const {
            name, description, code, value,
            start_date, end_date, max_use, max_use_per_user,
            type, min_order_value, applies_to, product_ids,
            shopId, max_value, used_count, used_users
        } = payload

        // check conditions
        validateDiscountInput(payload)

        // create index for discount code
        const foundDiscount = await findOneByCodeAndShopId({ code, shopId })

        if (foundDiscount) throw new BadRequestError("Discount existed.")

        const newDiscount = await discount.create({
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_code: code,
            discount_start_date: new Date(start_date),
            discount_end_date: new Date(end_date),
            discount_max_use: max_use,
            discount_used_count: used_count,
            discount_used_users: used_users,
            discount_max_use_per_user: max_use_per_user,
            discount_min_order_value: min_order_value || 0,
            discount_is_active: true,
            discount_applies_to: applies_to,
            discount_product_ids: applies_to === "specific" ? product_ids : [],
            discount_shopId: shopId
        })
        return newDiscount
    }

    static updateDiscount = async (payload) => {
        const objParams = removeUndefinedObject(payload)
        const {discount_code: code, discount_shopId: shopId} = objParams
        if (!code || ! shopId) throw new BadRequestError('Have trouble in updating discount.')
        return await updateDiscountByCodeAndShopId({code, shopId}, objParams)
    }

    static getAllProductsByDiscountCode = async ({
        code, shopId, page=1, limit=10,
        select=['product_name', 'product_price']
    }) => {
        // create index for discount_code
        const foundDiscount = await findOneByCodeAndShopId({ code, shopId })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount does not exist')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount

        const filter = {
            isPublished: true
        }
        if (discount_applies_to === 'specific') filter['_id'] = { $in: discount_product_ids }
        if (discount_applies_to === 'all') filter['product_shop'] = convertStringToMongoDbObject(shopId)

        const products = await findAllProducts({
            page: +page,
            limit: +limit, 
            filter,
            select,
            sort: 'ctime'
        })
        return products
    }

    static getAllDiscountCodesByShopId = async (id) => {
        return await findDiscountsUnselect({
            filter: {
                discount_shopId: convertStringToMongoDbObject(id)
            },
            page: 1,
            limit: 50,
            unselect: ['__v', 'discount_shop_id']
        })
    }

    static getAllDiscountsSelectByProduct = async ({
        productId, shopId, userId, page=1, limit=10, 
        select=['discount_code','discount_shopId', 'discount_name', 'discount_value']
    }) => {
        return await findDiscountsSelect({
            filter: {
                discount_shopId: shopId,
                // if 'all': accept 
                // if 'specific: find productId in discount_product_ids
            },
            page: +page,
            limit: +limit,
            sort: 'ctime',
            select: select
        })
    }

    static getAllDiscountsUnSelectByProduct = async ({
        productId, shopId, userId, page, limit, 
        unselect=['discount_code','discount_shopId', 'discount_name', 'discount_value']
    }) => {
        return await findDiscountsUnselect({
            filter: {
                discount_shopId: shopId,
                // if 'all': accept 
                // if 'specific: find productId in discount_product_ids
            },
            page: +page,
            limit: +limit,
            sort: 'ctime',
            unselect: unselect
        })
    }

}

module.exports = DiscountService