'use strict'

const AccessService = require('../services/access.service.js')
const { Created } = require('../core/success.response.js')

class AccessController {
    static signUp = async (req, res, next) => {
        new Created(
            {
                message: "Sign up",
                metadata: await AccessService.signUp(req.body)
            }
        ).send(res)
    }
}

module.exports = AccessController