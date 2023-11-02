const app = require('./src/app.js')
const { APP_PORT } = require('./src/configs/index.js')


app.listen(APP_PORT, () => {
    console.log(`App is listening on ${APP_PORT}`)
})