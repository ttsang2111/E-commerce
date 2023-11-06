const express = require('express')
const router = express.Router()
const { apiKey, checkPermission } = require('../auth/middlewares.auth.js')
const { asyncHandler } = require('../helpers')

// check api key
router.use(apiKey)

// check permission
router.use(checkPermission('000'))

router.use('/v1/api', require('./access'))
router.use('/v1/api/product', require('./product'))


module.exports = router