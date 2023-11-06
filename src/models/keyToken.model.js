const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'TokenKey'
const COLLECTION_NAME = 'TokenKeys'

var tokenKeySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    
    refreshToken: {
        type: String,
        required: true
    },
    refreshTokenUsed: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});


module.exports = model(DOCUMENT_NAME, tokenKeySchema);