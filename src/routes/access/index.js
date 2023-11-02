const express = require('express')
const router = express.Router()
const AccessController = require('../../controllers/access.controller.js')

router.post('/shop/signup', AccessController.signUp)

module.exports = router