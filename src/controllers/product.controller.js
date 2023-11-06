'use strict'

const { ProductFactory } = require('../services/product.service.js')
const { Created, SucessResponse } = require('../core/success.response.js')

class ProductController {

    static createProduct = async (req, res, next) => {
        new Created(
            {
                message: "Create a product successfully",
                metadata: await ProductFactory.createProduct(req.body.product_type, {
                    ...req.body,
                    product_shop: req.user.userId
                })
            }
        ).send(res)
    }

}

module.exports = ProductController