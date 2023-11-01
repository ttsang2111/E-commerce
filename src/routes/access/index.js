const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller.js')

router.get('/shop/signup', AccessController.signup)

module.exports = router