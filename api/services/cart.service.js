'use strict'

const { getProduct } = require('../controllers/product.controller')
const { NotFoundError, BadRequestError } = require('../core/error.response')
const { cart } = require('../models/cart.model')
const { getProductById } = require('../models/repositories/product.repo')
/*
    Key features: Cart Service
    - Add product to Cart [User]
    - Decrease product quantity [User]
    - Increase product quantity [User]
    - Get list to Cart [User]
    - Delete cart [User]
    - Delete cart item [User]
*/

class CartService {

    // START REPO CART
    static async createUserCart({ userId, product }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateOrInsert = {
                cart_products: product
            },
            options = { upsert: true, new: true }
        return await cart.findOneAndUpdate(query, updateOrInsert, options)
    }
    // END REPO CART

    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity } = product
        if (!productId || !quantity) throw new BadRequestError('Invalid input!')
        const query = {
            cart_userId: userId,
            'cart_products.productId': productId,
            cart_state: 'active'
        }, updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        }, options = {upsert: true, new: true}
        return await cart.findOneAndUpdate(query, updateSet, options)
    }

    static async addToCart({ userId, product }) {
        // check  existance of cart in db
        const userCart = await cart.findOne({ cart_userId: userId })
        // get product in db
        if (!userCart) {
            // create a new cart
            return await CartService.createUserCart({ userId, product })
        }

        // In case cart already exists, but there are no products
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product]
            return await userCart.save()
        }
        // In case cart already exists but not found product
        if (!userCart.cart_products.find(p => p.productId === product.productId)) {
            userCart.cart_products.push(product)
            return await userCart.save()
        }

        // In case both cart and product already exist
        return await CartService.updateUserCartQuantity({ userId, product })
    }

    // update a cart
    static async addToCartV2 ({ userId, shop_order_ids }) {
        /*
        shop_order_ids: [
            {
                shopId,
                item_products: [
                    {
                        productId,
                        shopId,
                        price,
                        old_quantity,
                        quantity
                    }
                ],
                version
            }
        ]
    */
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]
        // check product existance
        const foundProduct = await getProductById(productId)
        if(!foundProduct) throw new NotFoundError("Not Found Product")
        // check product shop
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product does not belong to the shop')
        }

        if(quantity == 0) {
            // deleted
            return await CartService.deleteUserCart({ userId, productId })
        }

        return await CartService.updateUserCartQuantity({
            userId,
            product: {
                productId,
                quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart ({ userId, productId }) {
        const query = { cart_userId: userId, cart_state: 'active'},
        updateSet = {
            $pull: {
                cart_products: {
                    productId
                }
            }
        }

        const deleteCart = await cart.updateOne(query, updateSet)
        return deleteCart
    }

    static async getListUserCart({ userId }) {
        return await cart.findOne({
            cart_userId: +userId
        }).lean()
    }
}

module.exports = CartService;