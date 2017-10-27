const hestiaa = require('hestiaa')
const DocsController = require('./controllers/docsController')
const HelloWorldController = require('./controllers/helloWorldController')

class Router {
  /**
   * Register routes into the given express instance.
   *
   * @param  {r}         callable Registers a route wrapped with error and response handling
   * @param  {rawRouter} router   Express instance (for advanced usage, without auto error/response handling)
   */
  static register (r, rawRouter) {
    rawRouter.get('/', hestiaa.http.catchError(DocsController.index))

    // rawRouter.get('/package-management/hello-world', httpResponseBuilder.buildResponse(HelloWorldController.sayHello))
    r('get', '/hestiaa-project/hello-world', HelloWorldController.sayHello)
  }
}

module.exports = Router
