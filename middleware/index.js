
const koaBody = require('koa-body')
const koaStatic = require('koa-static')

const path = require('path')

module.exports = app => {
  app
    .use(koaBody({ multipart: true }))
    .use(koaStatic(path.join(__dirname, '..', 'static')))
}
