const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(helmet())
app.use(morgan("dev"));

// init database
require('./dbs/init.mongodb.js')
const { countConnections } = require('./helpers/check.connect.js')
countConnections()

// init routes
app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello world!"
    })
})

module.exports = app