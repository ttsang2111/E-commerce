'use strict'

const { BadRequestError } = require("../core/error.response")
const discountModel = require("../models/discount.model")
const { searchAllProducts } = require('../models/repositories/product.repo')
const { convertStringToMongoDbObject } = require("../utils")

class DiscountService {
    static createDiscount = async(payload) => {

    }

    static updateDiscount = async(payload) => {

    }

    static getAllProductsByDiscountCode = async({
        code, shopId, userId, page, limit
    }) => {
        // create index for discount_code
        const foundDiscount = await discountModel.findOne({
            discount_code: code,
            discount_shopId: shopId
        }).lean()
        if(!foundShop || !foundShop.discount_is_active) {
            throw new BadRequestError('Discount does not exist')
        }
        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all') {
            products = await searchAllProducts({
                page: 1, limit: 10,
                filter: {
                    product_shop: convertStringToMongoDbObject(shopId),
                    isPublished: true
                }, 
                select: ['product_name', 'product_price']
            })
        } 

        if (discount_applies_to == 'specific') {
            products = await searchAllProducts({
                page: 1, limit: 10,
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true
                }, 
                select: ['product_name', 'product_price']
            })
        }
        return products       
    }

    static getAllDiscountsSelectByProduct = async ({
        productId, shopId, userId, page, limit, select
    }) => {
        
    }

    static getAllDiscountsUnSelectByProduct = async ({
        productId, shopId, userId, page, limit, unSelect
    }) => {

    }
    
}

module.exports = DiscountService