
module.exports = (router, controller) => {
  router
    .prefix('/sse')
    .get('/notice', controller.notice)
    
  return router
}
