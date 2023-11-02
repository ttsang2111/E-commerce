const mongoose = require('mongoose')
const { db: {host, port, name} } = require('../configs/index.js')

class Database {
    constructor() {
        this.connect()
    }

    connect = () => {
        mongoose.connect(`mongodb://${host}:${port}/${name}`)
            .then(() => console.log(`Connecting to: mongodb://${host}:${port}/${name}`))
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