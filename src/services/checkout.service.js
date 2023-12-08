'use strict'

const { BadRequestError, NotFoundError } = require("../core/error.response")
const { findCartById } = require('../models/repositories/cart.repo')
const { checkProductByServer } = require('../models/repositories/product.repo')
const { getDiscountAmount } = require("./discount.service")
const { acquireLock, releaseLock } = require("./redis.service")
const { order } = require('../models/order.model')

class CheckoutService {
    // login or without login
    /*
        {
            cartId,
            userId,
            shop_order_ids: [
                {
                    shopId,
                    shop_discounts: [

                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId,
                        },
                        {
                            price,
                            quantity,
                            productId,
                        }
                    ]
                },
                {
                    shopId,
                    shop_discounts: [
                        {
                            shopId,
                            discountId,
                            codeId,
                            
                        }
                    ],
                    item_products: [
                        {
                            price,
                            quantity,
                            productId
                        },
                        {
                            price: 1000
                            quantity: 2
                            productId
                        }
                    ]
                }
            ]
        }
    */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }) {
        // check cartId existance
        const foundCart = await findCartById(cartId)
        if (!foundCart) throw new BadRequestError('Not found cart!')

        const checkout_order = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0
        }, shop_order_ids_new = []

        // calculate bill
        for (let i = 0; i < shop_order_ids.length; i++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[i]
            // check product available
            const checkProductServer = await checkProductByServer(item_products)
            console.log(`checkProductServer:::`, checkProductServer)
            if (!checkProductServer[0]) throw new BadRequestError('Order wrong!!!')

            const checkoutPrice = checkProductServer.reduce((acc, product) => {
                return acc + (product.quantity * product.price)
            }, 0)

            // total price before handling
            checkout_order.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                rawPrice: checkoutPrice,
                discountPrice: 0,
                appliedDiscountPrice: checkoutPrice,
                item_products: checkProductServer
            }

            // If `shop_discounts` is existed and > 0, check validation
            if (shop_discounts.length > 0) {
                // in case only have 1 discount
                // get amount discount
                const { totalPrice = 0, discount = 0 } = await getDiscountAmount({
                    code: shop_discounts[0].code,
                    userId,
                    shopId,
                    products: checkProductServer
                })
                if (discount > 0) {
                    itemCheckout.appliedDiscountPrice = checkoutPrice - discount
                    itemCheckout.discountPrice = discount
                    checkout_order.totalDiscount += discount
                }
            }

            // final total price
            checkout_order.totalCheckout += itemCheckout.appliedDiscountPrice
            shop_order_ids_new.push(itemCheckout)
        }
        return {
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    // order
    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {},
        user_payment
    }) {
        const { shop_order_ids_new, checkout_order } = await CheckoutService.checkoutReview({
            cartId, userId, shop_order_ids
        })

        // check again: over quantity of invetory?
        // get new Products
        const products = shop_order_ids_new.flatMap(order => order.item_products)
        console.log(`[1]:`, products)
        for (let i = 0; i < products.length; i++) {
            const acquireProduct = []
            // use optimistic lock
            const { productId, quantity } = products[i]
            const keyLock = await acquireLock(productId, quantity, cartId)
            acquireProduct.push(keyLock ? true : false)
            if (keyLock) {
                await releaseLock(keyLock)
            }
        }

        // check neu co mot san pham het hang trong kho
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Mot so san pham da duoc cap nhat, vui long quay lai gio hang...')
        }

        const newOrder = await order.create({
            order_userId: userId,
            order_checkout: checkout_order,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new,

        })

        if (newOrder) {
            // remove product in cart
        }
        return newOrder
    }

    /*
    1> Query orders [Users]
    */
    static async getOrdersByUser() {

    }

    /*
     1> Query order by using id [Users]
     */
    static async getOrderByUser(id) {

    }

    /*
    1> Cancel orders [Users]
    */
    static async cancelOrderByUser() {

    }

    /*
     1> Update order status [Shop | Admin]
     */
    static async updateOrderStatusByShop() {

    }

}

module.exports = CheckoutService