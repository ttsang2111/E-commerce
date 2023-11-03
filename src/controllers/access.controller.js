'use strict'

const AccessService = require('../services/access.service.js')
const { Created, SucessResponse } = require('../core/success.response.js')

class AccessController {
    static login = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Login",
                metadata: await AccessService.login(req.body)
            }
        ).send(res)
    }

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