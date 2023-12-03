const dev = {
    port: process.env.DEV_APP_PORT || 3050

}

const pro = {
    port: process.env.PRO_APP_PORT || 3000
}

const config = { dev, pro }
module.exports = config