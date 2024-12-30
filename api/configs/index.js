const configs = {
    app: require('./app'),
    mongodb: require('./mongodb'),
    cloudinary: require('./cloudinary')
}

const env = process.env.NODE_ENV || 'dev'
module.exports = (configName) => configs[configName][env]