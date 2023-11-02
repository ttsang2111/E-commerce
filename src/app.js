const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewares
app.use(helmet())
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// init database
require('./dbs/init.mongodb.js')

// init routes
app.use(require('./routes/index.js'))

module.exports = app