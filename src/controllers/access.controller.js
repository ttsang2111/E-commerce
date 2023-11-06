'use strict'

const AccessService = require('../services/access.service.js')
const { Created, SucessResponse } = require('../core/success.response.js')

class AccessController {
    static handleRefreshToken = async (req, res, next) => {
        new SucessResponse(
            {
                message: 'Refresh token',
                metadata: await AccessService.handleRefreshTokenV2({ keyStore: req.keyStore, user: req.user, refreshToken: req.refreshToken })
            }
        ).send(res)
    }

    static logout = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Logout successfully",
                metadata: await AccessService.logout({ keyStore: req.keyStore })
            }
        ).send(res)
    }

    static login = async (req, res, next) => {
        new SucessResponse(
            {
                message: "Login successfully",
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