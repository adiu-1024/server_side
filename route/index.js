
const fs = require('fs')
const path = require('path')

const Router = require('koa-router')
const router = new Router()

const dirname = path.join(__dirname, 'lib')

module.exports = app => {
  fs
    .readdirSync(dirname)
    .filter(f => f.includes('.') && f.endsWith('.js'))
    .forEach(async f => {
      const controller = await import(`../controller/${f}`)
      import(path.join(dirname, f)).then(module => {
        const route = module.default(new Router(), controller.default)
        router.use(route.routes(), route.allowedMethods())
      })
    })

  app
    .use(router.routes())
    .use(router.allowedMethods())
}
