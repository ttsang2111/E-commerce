const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const app = express();

// init middlewares
app.use(helmet())
app.use(morgan("dev"))
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

// // test pub sub redis
// const InventoryServiceTest = require('./test/inventory.test.js');
// (async () => {
//     await InventoryServiceTest.subscribe();
// })();
// const test_product = require('./test/product.test.js')
// test_product.purchaseProduct("001", 100)

// init database
require('./dbs/init.mongodb.js')

// init routes
app.use(require('./routes/index.js'))

// error handling middlewares called
app.use((req, res, next) => {
    const err = new Error("Not Found!")
    err.status = 404
    next(err)
})

// middleware error handler 
app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        status: error.status || 500,
        message: error.message || "Internal Server Error.",
    })
    if (error.stack) {
        console.log('ERROR STACK:::', error.stack)
    }
})

module.exports = app