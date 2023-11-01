const mongoose = require('mongoose')
const { DB_HOST, DB_PORT, APP_NAME } = require('../configs/index.js')

class Database {
    constructor() {
        this.connect()
    }

    connect = () => {
        mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${APP_NAME}`)
            .then(() => console.log(`Connecting to: mongodb://${DB_HOST}:${DB_PORT}/${APP_NAME}`))
            .catch(err => console.log(err))
    }

    static getInstance = () => {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
const instanceMongoDb = Database.getInstance()
module.exports = instanceMongoDb