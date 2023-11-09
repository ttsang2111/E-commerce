'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const { RoleShop } = require('../constants/index.js')
const { verifyJWT } = require('../auth/utils.auth.js')
const shopModel = require('../models/shop.model.js')
const KeyTokenService = require('./tokenKey.service.js')
const { findByEmail } = require('./shop.service.js')
const { removeTokenKeyById } = require('./tokenKey.service.js')
const { createPairTokens } = require('../auth/utils.auth.js')
const { getIntoData } = require('../utils/index.js')
const { BadRequestError, ForbiddenError, AuthFailureError } = require('../core/error.response.js')

class AccessService {
    
    static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
        const { userId, email } = user

        if (!keyStore) throw new AuthFailureError('1-Shop not registered')

        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('2-Shop not registered')

        const tokens = await createPairTokens({ userId, email }, keyStore.publicKey, keyStore.privateKey)

        await keyStore.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user: { userId, email },
            tokens
        }
    } 

    static handleRefreshToken = async ({ refreshToken }) => {
        const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken)
        if (foundToken) {
            // decode to figure out user
            const { userId, email } = verifyJWT(refreshToken, foundToken.publicKey)
            console.log({ userId, email })
            if (!userId) throw new BadRequestError(`Invalid authentication`)
            await KeyTokenService.deleteKeysByUserId(userId)
            throw new ForbiddenError('Something wrong happened !! Please relogin')
        }
        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken)
        if (!holderToken) throw new AuthFailureError('1-Shop not registered')

        const {userId, email} = await verifyJWT(refreshToken, holderToken.publicKey)
        console.log('2--', { userId, email })

        const foundShop = await findByEmail({email})
        if (!foundShop) throw new AuthFailureError('2-Shop not registered')

        const tokens = await createPairTokens({ userId, email }, holderToken.publicKey, holderToken.privateKey)

        await holderToken.updateOne({
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokenUsed: refreshToken
            }
        })
        return {
            user: { userId, email},
            tokens
        }
    } 
 
    static logout = async ({ keyStore }) => {
        const delKey = await removeTokenKeyById(keyStore._id)
        return delKey
    }
    /*
    1- find account in db by email
    2- match password
    3- find keyStore by id
    3.1- generate tokens
    3.2- create AT and RT and save
    4- return data
    */
    static login = async ({ email, password, refreshToken = null }) => {
        try {
            //1
            const foundShop = await findByEmail({ email })
            if (!foundShop) throw new BadRequestError('Login failed: Not found email')
            //2
            const match = await bcrypt.compare(password, foundShop.password)
            console.log("Match:::", match)
            if (!match) {
                throw new BadRequestError('Login failed: Wrong password')
            }
            //3
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
            //4
            await KeyTokenService.createKeyToken({
                userId,
                publicKey,
                privateKey,
                refreshToken: tokens.refreshToken,
                accessToken: tokens.accessToken
            })

            //5
            return {
                shop: getIntoData({ object: foundShop, field: ["_id", "name", "email"] }),
                tokens
            }
        } catch (error) {
            throw error
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

                // store keys to db
                const publicKeyString = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey,
                    refreshToken: tokens.refreshToken,
                    accessToken: tokens.accessToken
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