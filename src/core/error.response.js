'use strict'

const statusCode = {
    FORBIDDEN: '403',
    CONFLICT: '409'
}

const reasonStatusCode = {
    FORBIDDEN: 'Forbidden error',
    CONFLICT: 'Conflict error'
}

class ErrorResponse extends Error {

    constructor(message, status) {
        super(message)
        this.status = status
    }
}

class BadRequestError extends ErrorResponse {
    constructor(message=reasonStatusCode.CONFLICT, status=statusCode.CONFLICT) {
        super(message, status)
    }

}

class ForbiddenError extends ErrorResponse {
    constructor(message=reasonStatusCode.FORBIDDEN, status=statusCode.FORBIDDEN) {
        super(message, status)
    }
}

module.exports = {
    BadRequestError,
    ForbiddenError
}