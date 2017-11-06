const hestiaa = require('hestiaa')
const DocsController = require('./controllers/docsController')
const HelloWorldController = require('./controllers/helloWorldController')

class Router {
  /**
   * Register routes into the given express instance.
   *
   * @param  {callable} r         Registers a route wrapped with error and response handling
   * @param  {express}  rawRouter Express instance (for advanced usage, without auto error/response handling)
   */
  static register (r, rawRouter) {
    rawRouter.get('/', hestiaa.http.catchError(DocsController.index))

    r('get', '/hestiaa-project/hello-world', HelloWorldController.sayHello)
    // or
    // rawRouter.get('/hestiaa-project/hello-world', httpResponseBuilder.buildResponse(HelloWorldController.sayHello))
  }
}

module.exports = Router
