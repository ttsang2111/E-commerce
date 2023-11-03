'use strict'

const bcrypt = require('bcrypt')
const crypto = require('crypto')
const shopModel = require('../models/shop.model.js')
const { RoleShop } = require('../constants/index.js')
const KeyTokenService = require('./keyToken.service.js')
const { createPairTokens } = require('../auth/authUltils.js')
const { BadRequestError } = require('../core/error.response.js')
const { getIntoData } = require('../utils/index.js')
class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            // step1: check existance of email
            const shopHolder = await shopModel.findOne({ email }).lean()
            if(shopHolder) {
                throw new BadRequestError('Shop already existed')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create( {
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })

            if (newShop) {
                // create private key and public key
                const  { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
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
                console.log( { privateKey, publicKey } ) 

                // store keys to db
                const publicKeyString = await KeyTokenService.createKeyToken( {
                    userId: newShop._id,
                    publicKey
                })

                if(!publicKeyString) {
                    throw new BadRequestError('publicKeyString is not found')
                }
                
                // create pair tokens
                const tokens = await createPairTokens( {userId: newShop._id, email}, publicKeyString, privateKey)
                console.log(`Created token successfully`, tokens)

                return {
                    code: 201,
                    metadata: {
                        shop: getIntoData( {object: newShop, field: ["name", "email"]} ),
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
                code: 'xyz', // xyz should point to signUp function
                message: error.message,
                status: error.status
            }
        }
    }
}

module.exports = AccessService;