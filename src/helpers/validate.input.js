'use strict'

const { BadRequestError } = require("../core/error.response")


const validateDiscountInput = (payload) => {
    try {
        const { start_date, end_date } = payload

        if (new Date(start_date) < new Date() || new Date(end_date) < new Date()) {
            throw new BadRequestError("Discount expired")
        }
    
        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError("Start date must be before end date")
        }
        return true
    } catch (error) {
        throw error
    }
    
}

module.exports = {
    validateDiscountInput
}