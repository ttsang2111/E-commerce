'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const { product, clothing, electronic } = require('../models/product.model')
const { findAllDraftsForShop,findAllPublishedForShop, publishProductByShop, unpublishProductByShop } = require('../models/repositories/product.repo')

// defind Factory class to create product
class ProductFactory {
    static registerProductType(type, productClass) {
        ProductFactory.productRegistry[type] = productClass
    }

    static productRegistry = {}

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        return await new productClass(payload).createProduct()
    }

    static findAllDraftsForShop = async ({ product_shop, limit=null, skip=0 }) => {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static findAllPublishedForShop = async ({ product_shop, limit=null, skip=0 }) => {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static findAllUnpublishedForShop = async ({ product_shop, limit=null, skip=0 }) => {
        const query = { product_shop, isPublished: false }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static publishProductByShop = async ( { product_shop, product_id } ) => {
        const foundProduct = await publishProductByShop({ product_shop, product_id })
        if (!foundProduct) throw new NotFoundError('Not found product for publishing')
        return foundProduct 
    }
    

    static unpublishProductByShop = async ( { product_shop, product_id } ) => {
        const foundProduct = await unpublishProductByShop({ product_shop, product_id })
        if (!foundProduct) throw new NotFoundError('Not found product for unpublishing')
        return foundProduct 
    }

}

class Product {
    constructor({
        product_name, product_thumb, product_description, product_price,
        product_type, product_shop, product_attributes, product_quantity
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
        this.product_quantity = product_quantity
    }

    // create new product
    async createProduct(product_id) {
        return await product.create({
            _id: product_id,
            ...this
        })
    }
}

class Clothing extends Product {

    async createProduct() {
        const newClothing = await clothing.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })

        if (!newClothing) throw new BadRequestError('Create new Clothing error')

        const newProduct = await super.createProduct(newClothing._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}

class Electronic extends Product {

    async createProduct() {
        const newElectronic = await electronic.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronic) throw new BadRequestError('Create new Electronic error')

        const newProduct = await super.createProduct(newElectronic._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }
}
ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)

module.exports = {
    ProductService: ProductFactory
}