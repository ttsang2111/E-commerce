'use strict'

const DiscountService = require('../services/discount.service.js')
const { Created, SucessResponse } = require('../core/success.response.js')
const successResponse = require('../core/success.response.js')

class DiscountController {

    // static getAllDiscountsByProduct = async (req, res, next) => {
    //     new SucessResponse({
    //         message: "Get all discounts by product successfully",
    //         metadata: await DiscountService.getAllDiscountsSelectByProduct({

    //         })
    //     }).send(res)
    // }

    static getAllProductsByDiscountCode = async (req, res, next) => {
        new SucessResponse({
            message: "Get all products by discount code successfully",
            metadata: await DiscountService.getAllProductsByDiscountCode({
                shopId: req.user.userId,
                code: req.params.code
            })
        }).send(res)
    }
    
    static getAllDiscountsByShop = async (req, res, next) => {
        new SucessResponse({
            message: "Get all discounts successfully",
            metadata: await DiscountService.getAllDiscountCodesByShopId(req.user.userId)
        }).send(res)
    }

    static createDiscount = async (req, res, next) => {
        new Created({
            message: "Created a discount successfully",
            metadata: await DiscountService.createDiscount(req.body)
        }).send(res)
    }

    static updateDiscount = async (req, res, next) => {
        new SucessResponse({
            message: "Updated a discount successfully",
            metadata: await DiscountService.updateDiscount(req.body)
        }).send(res)
    }
}

module.exports = DiscountController