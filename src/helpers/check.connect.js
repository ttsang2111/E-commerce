'use strict'

const mongoose = require('mongoose')

const countConnections = () => {
    const numConnections = mongoose.connections.length
    console.log(`Number of connections: ${numConnections}`)
}

const checkOverload = () => {
    const numConnections = mongoose.connections.length
    const maxConnections = 10

    if (numConnections > maxConnections) {
        console.log(`Connection overload detected`)
    }
}

module.exports = {
    countConnections,
    checkOverload
}
