
const koaBody = require('koa-body')
const koaStatic = require('koa-static')

const path = require('path')

module.exports = app => {
  app
    .use(async (ctx, next) => {
      ctx.url.startsWith('/sse') && ctx.set('Content-Type', 'text/event-stream')
      await next()
    })
    .use(koaBody({ multipart: true }))
    .use(koaStatic(path.join(__dirname, '..', 'static')))
}
