'use strict'

const keyTokenModel = require("../models/keyToken.model")

class KeyTokenService {
    
    static createKeyToken = async ( { userId, publicKey, privateKey, refreshToken }) => {
        try {
            const tokens = await keyTokenModel.create ({
                userId, publicKey, privateKey, refreshToken
            })
            return tokens ? tokens.publicKey : null
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = KeyTokenService