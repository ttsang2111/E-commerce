'use strict'

const AccessService = require('../services/access.service.js')

class AccessController {
    static signup = (req, res, next) => {
        return res.status(201).json(AccessService.signup())
    }
}

module.exports = AccessController