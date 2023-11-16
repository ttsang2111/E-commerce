'use strict'

const redis = require('redis')
const { promisify } = require('util')
const redisClient = redis.createClient()
const { reservationInventory } = require('../models/repositories/inventory.repo')

const pExpire = promisify(redisClient.pExpire).bind(redisClient)
const setExAsync = promisify(redisClient.setEx).bind(redisClient)

const acquireLock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`
    const retryTime = 10
    const expireTime = 3000; // 3s lock temporarily

    for (let i = 0; i < retryTime; i++) {
        // create a key, who holding the key is allowed to pay
        const result = await setExAsync(key, expireTime)
        console.log(`result:::`, result)
        if (result === 1) {
            // manipulate inventory
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            })
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime)
                return key
            }
            return null
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async keyLock => {
    const delAsyncKey = promisify(redisClient.del).bind(redisClient)
    return await delAsyncKey(keyLock)
}

module.exports = {
    acquireLock,
    releaseLock
}


