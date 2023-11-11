'use strict'

const { ProductService } = require('../services/product.service.js')
const { Created, SucessResponse } = require('../core/success.response.js')

class ProductController {

    static updateProduct = async (req, res, next) => {
        new SucessResponse({
            message: "Update a product successfully",
            metadata: await ProductService.updateProduct(
                req.body.product_type,
                req.params.productId,
                {
                    ...req.body,
                    product_shop: req.user.userId
                })
        }).send(res)
    }

    static getProduct = async (req, res, next) => {
        new SucessResponse({
            message: "Get a product successfully",
            metadata: await ProductService.findProduct(req.params.id)
        }).send(res)
    }

    static getAllProducts = async (req, res, next) => {
        new SucessResponse({
            message: "Get all products successfully",
            metadata: await ProductService.searchAllProducts(req.query)
        }).send(res)
    }

    static getProductsByUser = async (req, res, next) => {
        new SucessResponse({
            message: "Get products by user successfully",
            metadata: await ProductService.searchProductsByUser({ keySearch: req.params.keySearch })
        }).send(res)
    }

    static createProduct = async (req, res, next) => {
        new Created(
            {
                message: "Create a product successfully",
                metadata: await ProductService.createProduct(req.body.product_type, {
                    ...req.body,
                    product_shop: req.user.userId
                })
            }
        ).send(res)
    }

    static getAllDraftForShop = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Get list drafts successfully",
                metadata: await ProductService.findAllDraftsForShop({
                    product_shop: req.user.userId
                })
            }
        ).send(res)
    }
    static getAllPublishedForShop = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Get list published products successfully",
                metadata: await ProductService.findAllPublishedForShop({
                    product_shop: req.user.userId
                })
            }
        ).send(res)
    }

    static getAllUnpublishedForShop = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Get list unpublished products successfully",
                metadata: await ProductService.findAllUnpublishedForShop({
                    product_shop: req.user.userId
                })
            }
        ).send(res)
    }

    static publishProductByShop = async (req, res, next) => {
        new SucessResponse({
            message: "Publish a product successfully",
            metadata: await ProductService.publishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    static unpublishProductByShop = async (req, res, next) => {
        new SucessResponse({
            message: "Unpublish a product successfully",
            metadata: await ProductService.unpublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

}

module.exports = ProductController