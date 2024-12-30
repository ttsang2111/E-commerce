'use strict'

const JWT = require('jsonwebtoken')

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error(`Verification error: ${err.message}`)
            } else {
                console.log(`Verification deocde`, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (err) {
        console.error(`createTokenPair error: ${err.message}`)
    }
}

const createToken = async (payload, key) => {
    try {
        const accessToken = await JWT.sign(payload, key, {
            expiresIn: '2 days'
        })

        const refreshToken = await JWT.sign(payload, key, {
            expiresIn: '7 days'
        })

        JWT.verify(accessToken, key, (err, decode) => {
            if (err) {
                console.error(`Error verification: ${err.message}`)
            } else {
                console.log(`Decode verification`, decode)
            }
        })

        return { accessToken, refreshToken }
    } catch (err) {
        console.error(`createToken error: ${err.message}`)
    }
}

const verifyJWT = async (token, keySecret) => {
    return JWT.verify(token, keySecret)
}
module.exports = {
    createToken,
    createPairTokens: createTokenPair,
    verifyJWT
}