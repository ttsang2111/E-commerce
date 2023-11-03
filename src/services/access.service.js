'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model.js')
const { RoleShop } = require('../constants/index.js')
const KeyTokenService = require('./keyToken.service.js')
const { createPairTokens } = require('../auth/authUltils.js')
const { BadRequestError } = require('../core/error.response.js')
const { getIntoData } = require('../utils/index.js')
const { findByEmail } = require('./shop.service.js')

class AccessService {

    /*
    1- find account in db by email
    2- match password
    3- generate tokens
    4- create AT and RT and save
    5- return data
    */
    static login = async ({ email, password, refreshToken = null }) => {
        try {
            //1.
            const foundShop = await findByEmail({ email })
            if (!foundShop) throw BadRequestError('Login failed')
            //2.
            const match = bcrypt.compare(password, foundShop.password)
            if (!match) {
                throw BadRequestError('Login failed')
            }
            //3.
            const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                modulusLength: 4096,
                publicKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                },
                privateKeyEncoding: {
                    type: 'pkcs1',
                    format: 'pem'
                }
            })
            const { _id: userId } = foundShop
            const tokens = await createPairTokens({ userId, email }, publicKey, privateKey)
            //4.
            await KeyTokenService.createKeyToken({
                userId,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken
            })
            //5.
            return {
                shop: getIntoData({ object: foundShop, field: ["name", "email"] }),
                tokens
            }
        } catch (error) {
            return {
                code: 'yy', // yy should point to login error in access.service
                message: error.message,
                status: error.status
            }
        }
    }

    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check existance of email
            const shopHolder = await shopModel.findOne({ email }).lean()
            if (shopHolder) {
                throw new BadRequestError('Shop already existed')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create private key and public key
                const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4096,
                    publicKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    },
                    privateKeyEncoding: {
                        type: 'pkcs1',
                        format: 'pem'
                    }
                })

                // create pair tokens
                const tokens = await createPairTokens({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Created token successfully`, tokens)

                // store keys to db
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken
                })
                if (!publicKeyString) {
                    throw new BadRequestError('publicKeyString is not found')
                }
                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData({ object: newShop, field: ["name", "email"] }),
                        tokens
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xx', // xx should point to signUp error in access.service
                message: error.message,
                status: error.status
            }
        }
    }
}

module.exports = AccessService;