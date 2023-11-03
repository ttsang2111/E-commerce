const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller.js')
const { asyncHandler } = require('../../helpers')

router.get('/test', (req, res) => {
    res.status(200).json({
        message: "Hello world"
    })
}) 
router.post('/shop/signup', asyncHandler(AccessController.signUp))
router.post('/shop/login', asyncHandler(AccessController.login))


module.exports = router