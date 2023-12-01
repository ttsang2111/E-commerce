'use strict';

const { createComment, getCommentsByParentId, deleteComments } = require('../services/comment.service')
const { SuccessResponse } = require('../core/success.response')

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new comment",
            metadata: await createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async(req, res, next) => {
        new SuccessResponse({
            message: "Get comments by parentId",
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComments = async(req, res, next) => {
        new SuccessResponse({
            message: "Delete comments successfully",
            metadata: await deleteComments({
                userId: req.user.userId,
                ...req.query
            })
        }).send(res)
    }
}

module.exports = new CommentController();