require('dotenv').config()
const app = require('./api')
const { port } = require('./api/configs/index.js')('app')


app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})