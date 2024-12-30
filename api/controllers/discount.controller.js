'use strict'

const DiscountService = require('../services/discount.service.js')
const { Created, SuccessResponse } = require('../core/success.response.js')

class DiscountController {

    static getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: "Get discount amount successfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
    

    static getAllDiscountsByProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all discounts by product successfully",
            metadata: await DiscountService.getAllDiscountsByProduct({
                ...req.query
            })
        }).send(res)
    }

    static getAllProductsWithDiscountCode = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all products by discount code successfully",
            metadata: await DiscountService.getAllProductsWithDiscountCode(req.query)
        }).send(res)
    }
    
    static getAllDiscounts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all discounts successfully",
            metadata: await DiscountService.getAllDiscountCodesByShop(req.user.userId)
        }).send(res)
    }

    static createDiscount = async (req, res, next) => {
        new Created({
            message: "Created a discount successfully",
            metadata: await DiscountService.createDiscount(req.user.userId, req.body)
        }).send(res)
    }

    static updateDiscount = async (req, res, next) => {
        new SuccessResponse({
            message: "Updated a discount successfully",
            metadata: await DiscountService.updateDiscount(req.user.userId, req.body)
        }).send(res)
    }
}

module.exports = DiscountController