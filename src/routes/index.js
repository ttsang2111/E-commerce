const express = require('express')
const router = express.Router()
const { apiKey, checkPermission } = require('../auth/middlewares.auth.js')
// const { pushToLogDiscord } = require('../middlewares/')

// // add log to discord
// router.use(pushToLogDiscord)
// check api key
router.use(apiKey)
// check permission
router.use(checkPermission('000'))

router.use('/v1/api/checkout', require('./checkout'))
router.use('/v1/api/discount', require('./discount'))
router.use('/v1/api/inventory', require('./inventory'))
router.use('/v1/api/cart', require('./cart'))
router.use('/v1/api/comment', require('./comment'))
router.use('/v1/api/product', require('./product'))
router.use('/v1/api/image', require('./cloudinary'))
router.use('/v1/api', require('./access'))

module.exports = router