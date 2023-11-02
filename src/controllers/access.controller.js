'use strict'

const AccessService = require('../services/access.service.js')

class AccessController {
    static signUp = async (req, res, next) => {
        const { name, email, password } = req.body
        return res.json(await AccessService.signUp({name, email, password}))
    }
}

module.exports = AccessController