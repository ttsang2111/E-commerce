'use strict'

const tokenKeyModel = require("../models/keyToken.model")
const { Types } = require('mongoose')

class TokenKeyService {
    
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken, accessToken }) => {
        try {
            const tokens = await tokenKeyModel.create ({
                userId, publicKey, privateKey, refreshToken, accessToken
            })
            return tokens ? tokens.publicKey : null
        } catch (err) {
            console.log(err)
        }
    }

    static getTokenKeyByUserId = async (userId) => {
        return await tokenKeyModel.findOne({ userId: new Types.ObjectId(userId) }).lean()
    }

    static getTokenKeyByRefreshToken = async ( refreshToken ) => {
        return await tokenKeyModel.findOne({ refreshToken })
    }

    static getTokenKeyByAccessToken = async ( accessToken ) => {
        return await tokenKeyModel.findOne({ accessToken })
    }

    static getTokenKeyById = async(id) => {
        return await tokenKeyModel.findOne({ _id: new Types.ObjectId(id)}).lean()
    }

    static removeTokenKeyById = async (id) => {
        return await tokenKeyModel.deleteOne({
            _id:  new Types.ObjectId(id)
        })
    }

    static findRefreshTokenUsed = async (refreshToken) => {
        return await tokenKeyModel.findOne({refreshTokenUsed: refreshToken}).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await tokenKeyModel.findOne({ refreshToken: refreshToken })
    }

    static deleteKeysByUserId = async (id) => {
        return await tokenKeyModel.deleteMany({ userId: new Types.ObjectId(id) })
    }
}

module.exports = TokenKeyService