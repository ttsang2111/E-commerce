'use strict'

const statusCode = {
    OK: 200,
    CREATED: 201
}

const reasonStatusCode = {
    OK: 'Ok',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({message, status, metadata={}}) {
        this.message = message
        this.status = status
        this.metadata = metadata
    }

    send(res) {
        res.json( this )
    }
}

class Created extends SuccessResponse {
    constructor({message=reasonStatusCode.CREATION, status=statusCode.CREATION, metadata}) {
        super({message, status, metadata})
    }
}

class Ok extends SuccessResponse {
    constructor({message=reasonStatusCode.OK, status=statusCode.OK}) {
        super({message, status, metadata})
    }
}

module.exports = {
    Created,
    Ok,
    SuccessResponse
}