
const middleware = require('./middleware')
const route = require('./route')

const Koa = require('koa')
const app = new Koa()

middleware(app)
route(app)

const PORT = process.env.PORT || process.env.npm_package_config_port

const HTTP_SERVER = app.listen(PORT, () => console.log(`Server is listening in ${PORT}`))
