'use strict'

const CartService = require('../services/cart.service')
const { SuccessResponse } = require('../core/success.response')

class CartController {
    /**
     * @description add to cart for user
     * @param {int} userId
     * @param {*} res
     * @param {*} next
     * @method post
     * @url /v1/api/car/user
     * @return 
     */
    addToCart = async (req, res, next) => {
        // new
        new SuccessResponse({
            message: "Create new cart successfully",
            metadata: await CartService.addToCart( req.body )
        }).send(res)
    }
    // + -
    update = async (req, res, next) => {
        new SuccessResponse({
            message: "Update cart successfully",
            metadata: await CartService.addToCartV2( req.body )
        }).send(res)
    }

    delete = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete cart successfully",
            metadata: await CartService.deleteUserCart( req.body )
        }).send(res)
    }

    listToCart = async (req, res, next) => {
        new SuccessResponse({
            message: "List cart successfully",
            metadata: await CartService.getListUserCart( req.body )
        }).send(res)
    }
}

module.exports = new CartController()