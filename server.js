require('dotenv').config()
const app = require('./src/app.js')
const { port } = require('./src/configs/index.js')('app')


app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})