const express = require('express')
const router = express.Router()
const { authentication, authenticationV2 } = require('../../auth/middlewares.auth.js')
const AccessController = require('../../controllers/access.controller.js')
const { asyncHandler } = require('../../helpers')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: "Hello world"
    })
}) 

router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))

// authentication
router.use(authenticationV2)

router.post('/shop/logout', asyncHandler(AccessController.logout))
router.post('/shop/refreshToken', asyncHandler(AccessController.handleRefreshToken))

module.exports = router