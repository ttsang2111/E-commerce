'use strict'

const CloudinaryService = require('../services/cloudinary.service')
const { SuccessResponse } = require('../core/success.response')


class CloudinaryController {
    upload = async (req, res, next) => {
        new SuccessResponse({
            message: "Upload image",
            metadata: await CloudinaryService.upload()
        }).send(res)
    }
}

module.exports = new CloudinaryController()