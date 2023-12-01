'use strict'

const { BadRequestError, NotFoundError } = require('../core/error.response')
const { product, clothing, electronic, furniture } = require('../models/product.model')
const { 
    findAllDraftsForShop,
    findAllPublishedForShop, 
    publishProductByShop, 
    unpublishProductByShop,
    searchProductsByUser,
    searchAllProducts,
    findProduct,
    updateProductById
} = require('../models/repositories/product.repo')
const { insertInventory } = require('../models/repositories/inventory.repo')
const { removeUndefinedObject, updateNestedObjectParser } = require('../utils/index')
const { pushNotiToSystem } = require('./notification.service')

// defind Factory class to create product
class ProductFactory {
    static registerProductType(type, productClass) {
        ProductFactory.productRegistry[type] = productClass
    }

    static productRegistry = {}
    
    static async updateProduct(type, productId, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        return await new productClass(payload).updateProduct(productId)
    }

    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]
        if (!productClass) throw new BadRequestError(`Invalid product type: ${type}`)
        return await new productClass(payload).createProduct()
    }
    static findProduct = async (id) => {
        return await findProduct({
            id,
            unSelect: ['__v', 'product_variations']
        })
    }

    static findAllDraftsForShop = async ({ product_shop, limit=50, skip=0 }) => {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static findAllPublishedForShop = async ({ product_shop, limit=50, skip=0 }) => {
        const query = { product_shop, isPublished: true }
        return await findAllPublishedForShop({ query, limit, skip })
    }

    static findAllUnpublishedForShop = async ({ product_shop, limit=50, skip=0 }) => {
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

    static searchProductsByUser = async( { keySearch } ) => {
        return await searchProductsByUser({ keySearch })
    }

    static searchAllProducts = async ({ sort='ctime', page=1, limit=50, filter={ isPublished: true} }) => {
        return await searchAllProducts( { 
            filter, 
            sort, 
            page, 
            limit,
            select: ['product_name', 'product_thumb', 'product_price', 'product_shop']
        })
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
        const newProduct = await product.create({
            _id: product_id,
            ...this
        })
        if (newProduct) {
            // add product_stock in inventory collection
            const invenData = await insertInventory({
                stock: this.product_quantity,
                shopId: this.product_shop,
                productId: newProduct._id
            })
            // push notification to system collection
            pushNotiToSystem({
                type: 'SHOP-001',
                receiverId: 1,
                senderId: this.product_shop,
                options: {
                    product_name: this.product_name,
                    shop_name: this.product_shop
                }
            }).then( rs => console.log(rs))
            .catch(console.error)
            
            console.log("invenData:::", invenData)
        }

        return newProduct
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({productId, bodyUpdate, model: product})
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

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this)

        if(objParams.product_attributes) {
            const attributesObjParams = removeUndefinedObject(objParams.product_attributes)
            await updateProductById({productId, bodyUpdate: updateNestedObjectParser(attributesObjParams), model: clothing})
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
        return updatedProduct
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

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this)

        if(objParams.product_attributes) {
            const attributesObjParams = removeUndefinedObject(objParams.product_attributes)
            await updateProductById({productId, bodyUpdate: updateNestedObjectParser(attributesObjParams), model: electronic})
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
        return updatedProduct
    }
}

class Furniture extends Product {

    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('Create new Furniture error')

        const newProduct = await super.createProduct(newFurniture._id)
        if (!newProduct) throw new BadRequestError('Create new Product error')

        return newProduct
    }

    async updateProduct(productId) {
        const objParams = removeUndefinedObject(this)

        if(objParams.product_attributes) {
            const attributesObjParams = removeUndefinedObject(objParams.product_attributes)
            await updateProductById({productId, bodyUpdate: updateNestedObjectParser(attributesObjParams), model: furniture})
        }

        const updatedProduct = await super.updateProduct(productId, updateNestedObjectParser(objParams))
        return updatedProduct
    }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = {
    ProductService: ProductFactory
}