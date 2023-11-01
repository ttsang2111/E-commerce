require('dotenv').config()

const config = {
    'DEV': {
        'APP_PORT': process.env.DEV_APP_PORT || 3000,
        'DB_HOST': process.env.DEV_DB_HOST || 'localhost',
        'DB_PORT': process.env.DEV_DB_PORT || 20717,
        'APP_NAME': process.env.DEV_APP_NAME || 'eCommerce'
    },
    'PRODUCT': {
        'APP_PORT': process.env.PRODUCT_APP_PORT || 3000,
        'DB_HOST': process.env.PRODUCT_DB_HOST || 'localhost',
        'DB_PORT': process.env.PRODUCT_DB_PORT || 20717,
        'APP_NAME': process.env.DEV_APP_NAME || 'eCommerce'
    },

}

module.exports = config.DEV