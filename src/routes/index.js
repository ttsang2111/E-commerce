const express = require('express')
const router = express.Router()
const { apiKey, checkPermission } = require('../auth/checkAuth')
const { asyncHandler } = require('../helpers')

// check api key
router.use(asyncHandler(apiKey))

// check permission
router.use(checkPermission('000'))

router.use('/v1/api', require('./access'))

module.exports = router