'use strict';
const { convertStringToMongoDbObject } = require('../utils');
const { NotFoundError, ForbiddenError, BadRequestError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { findProduct } = require('../models/repositories/product.repo');
/*
    key features: Comment service
    + add comment [User, Shop]
    + get a list of comments [User, Shop]
    + delete a comment [User | Shop | Admin]
*/
class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        if(!productId || !userId || !content) throw new BadRequestError("Invalid parameters!")

        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        });

        let rightValue;
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId);
            if(!parentComment) throw new NotFoundError('Parent comment not found');

            rightValue = parentComment.comment_right;

            // updateMany comments
            await Comment.updateMany({
                comment_productId: convertStringToMongoDbObject(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            }) 
            await Comment.updateMany({
                comment_productId: convertStringToMongoDbObject(productId),
                comment_left: { $gte: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertStringToMongoDbObject(productId),
            }, 'comment_right', { sort: { comment_right: -1 } });
            if (maxRightValue) {
                rightValue = maxRightValue + 1;
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue;
        comment.comment_right = rightValue + 1;

        await comment.save();
        return comment;
    }

    static async getCommentsByParentId({
        productId,
        parentCommentId=null,
        limit=50,
        offset=0 // skip
    }) {
        let comments;
        if (parentCommentId) {
            const parent = await Comment.findById(parentCommentId);
            if (!parent) throw new NotFoundError("Not found comment for product");
            
            comments = await Comment.find({
                comment_productId: convertStringToMongoDbObject(productId),
                isDeleted: false,
                comment_left: { $gt: parent.comment_left},
                comment_right: { $lte: parent.comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments;
        }

        comments = await Comment.find({
            comment_productId: convertStringToMongoDbObject(productId)
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments;
    }
    
    static async deleteComments({ userId, commentId, productId }) {
        // check the product exists in database
        const foundProduct = await findProduct({id: productId});
        if (!foundProduct) throw new NotFoundError("Not Found Product!");

        // check the comment exists in database
        const comment = await Comment.findById(commentId);
        if (!comment) throw new NotFoundError("Not Found Comment!");

        if (foundProduct.product_shop.toString() !== userId && comment.comment_userId !== userId) {
            console.log("[ShopId]", foundProduct.product_shop)
            console.log("[UserId]", comment.comment_userId)
            throw new ForbiddenError("Only shop or user can delete the comment!")
        }

        const leftValue = comment.comment_left;
        const rightValue = comment.comment_right;
        // calculate width 
        const width = rightValue - leftValue + 1;

        // delete comment and nested comments
        await Comment.deleteMany({
            comment_productId: convertStringToMongoDbObject(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        // update remain comments
        await Comment.updateMany({
            comment_productId: convertStringToMongoDbObject(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: {
                comment_left: -width
            }
        });

        await Comment.updateMany({
            comment_productId: convertStringToMongoDbObject(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: {
                comment_right: -width
            }
        });
        return comment;
    }
}

module.exports = CommentService