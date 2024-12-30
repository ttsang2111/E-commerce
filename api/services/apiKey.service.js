'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async( key ) => {
    await genTestApiKey()
    const objKey = await apikeyModel.findOne( {key} ).lean()
    return objKey
}

const genTestApiKey = async() => {
    const newKey = 'test_api_key'
    const apiKeyObj = await apikeyModel.findOne( {key: newKey} )
    if ( apiKeyObj ) {
        return
    } else {
        await apikeyModel.create({key: newKey, status: true, permissions: ['000']})
    }
}

const genNewKey = async( status=true, permissions=['000'] ) => {
    const newKey = crypto.randomBytes(32).toString('hex')
    console.log("New key: ", newKey)
    await apikeyModel.create({key: newKey, status: status, permissions: permissions})
    return newKey
}

module.exports = {
    findById,
    genNewKey
}