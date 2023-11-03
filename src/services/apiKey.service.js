'use strict'

const apikeyModel = require("../models/apikey.model")
const crypto = require('crypto')

const findById = async( key ) => {
    const objKey = await apikeyModel.findOne( {key}).lean()
    return objKey
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