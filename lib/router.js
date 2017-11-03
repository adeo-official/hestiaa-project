const catchError = require('hestiaa').http.catchError
const DocsController = require('./controllers/docsController')
const BoxController = require('./controllers/boxController')
const ProductController = require('./controllers/productController')

/**
 * @swagger
 * tags:
 *   - name: hestiaa
 *     description: API of **hestiaa** project.
 */
class Router {
  /**
   * Register routes into the given express instance.
   *
   * @param {Function} Function used to registers a route, wrapping error and response handling
   * @param {express} app The `express` instance
   */
  static register (r, app) {
    app.get('/', catchError(DocsController.index))

    r('post', '/hestiaa/box', BoxController.create)
    r('get', '/hestiaa/box', BoxController.findAll)
    r('get', '/hestiaa/box/:id', BoxController.findById)
    r('put', '/hestiaa/box/:id', BoxController.update)
    r('delete', '/hestiaa/box/:id', BoxController.delete)

    r('post', '/hestiaa/box/:boxId/product', ProductController.create)
    r('put', '/hestiaa/box/:boxId/product/:id', ProductController.update)
    r('delete', '/hestiaa/box/:boxId/product/:id', ProductController.delete)
  }
}

module.exports = Router
