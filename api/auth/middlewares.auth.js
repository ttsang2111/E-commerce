'use strict'

const JWT = require('jsonwebtoken')
const { Headers } = require('../constants')
const { asyncHandler } = require('../helpers')
const { findById } = require('../services/apiKey.service')
const KeyTokenService = require('../services/tokenKey.service.js')
const { getTokenKeyByUserId, getTokenKeyByRefreshToken } = require('../services/tokenKey.service')
const { ForbiddenError, AuthFailureError, NotFoundError } = require('../core/error.response')

const apiKey = async (req, res, next) => {
    const key = req.headers[Headers['API_KEY']]?.toString()
    if (!key) {
        throw new ForbiddenError('API key')
    }
    const objKey = await findById(key)
    if (!objKey) {
        throw new ForbiddenError('API key not found')
    }
    req.objKey = objKey
    next()
}

const checkPermission = (key) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            throw new ForbiddenError('Permission')
        }

        if (!req.objKey.permissions.includes(key)) {
            throw new ForbiddenError('Permission denied')
        }
        next()
    }
}


const authentication = asyncHandler(async (req, res, next) => {
    //1
    const userId = req.headers[Headers['CLIENT_ID']]
    if (!userId) throw new AuthFailureError('Invalid Request')
    //2
    const accessToken = req.headers[Headers['AUTHORIZATION']]
    if (!accessToken) throw new AuthFailureError('Invalid Request')
    //3
    const keyStore = await getTokenKeyByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not Found keyStore')

    try {
        //4        
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
        //5
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')
        //6
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    // get userId from header
    const userId = req.headers[Headers['CLIENT_ID']]
    if (!userId) throw new AuthFailureError('1--Invalid Request')
    // get refreshToken from header
    const refreshToken = req.headers[Headers['REFRESH_TOKEN']]
    if (refreshToken) {
        // check used refreshToken
        const foundToken = await KeyTokenService.findRefreshTokenUsed(refreshToken)
        if (foundToken) {
            await KeyTokenService.deleteKeysByUserId(userId)
            throw new ForbiddenError('Something wrong happened !! Please relogin')
        }
        // get tokenKey from database
        const keyStore = await getTokenKeyByRefreshToken(refreshToken)
        if (!keyStore) throw new NotFoundError('Not found keyStore')
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.publicKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')

            req.refreshToken = refreshToken
            req.user = decodeUser
            req.keyStore = keyStore
            return next()
        } catch (error) {
            throw error
        }
    }

    const accessToken = req.headers[Headers['ACCESS_TOKEN']]
    if (!accessToken) { throw new AuthFailureError('2--Invalid Request') }
    else {
        // get tokenKey from database
        const keyStore = await KeyTokenService.getTokenKeyByAccessToken(accessToken)
        if (!keyStore) throw new NotFoundError('Not found keyStore')
        try {
            const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid userId')

            req.user = decodeUser
            req.keyStore = keyStore
            return next()
        } catch (error) {
            throw error
        }
    }
})


module.exports = {
    apiKey: asyncHandler(apiKey),
    checkPermission,
    authentication,
    authenticationV2
}