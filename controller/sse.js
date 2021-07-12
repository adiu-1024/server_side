
class Controller {
  static notice(ctx) {
    ctx.body = `event: notice\nretry: 5000\ndata:${new Date().toLocaleString()}\n\n`
  }
}

module.exports = Controller
