'use strict';

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

const Headers = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    REFRESH_TOKEN: 'x-rtoken-id',
    ACCESS_TOKEN: 'authorization'
}

module.exports = {
    RoleShop,
    Headers
}
