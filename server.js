const app = require('./src/app.js')
const { app: {port} } = require('./src/configs/index.js')


app.listen(port, () => {
    console.log(`App is listening on ${port}`)
})