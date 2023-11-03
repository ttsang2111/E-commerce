'use strict'

const { HEADER } = require('../constants/index')
const { findById } = require('../services/apiKey.service')
const { ForbiddenError } = require('../core/error.response')

const apiKey = async (req, res, next) => {
    const key = req.headers[HEADER.API_KEY]?.toString()
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

module.exports = {
    apiKey,
    checkPermission
}