const express = require('express')
const router = express.Router()
const { authenticationV2 } = require('../../auth/middlewares.auth.js')
const CommentController = require('../../controllers/comment.controller.js')
const { asyncHandler } = require('../../helpers/index.js')

// Authentication
router.use(authenticationV2)
////////////////////////////////

router.post('', asyncHandler(CommentController.createComment))
router.get('', asyncHandler(CommentController.getCommentsByParentId))

module.exports = router