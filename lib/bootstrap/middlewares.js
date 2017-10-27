const bodyParser = require('body-parser')
const expressBusboy = require('express-busboy')
const hestiaa = require('hestiaa')
const Router = require('../router')
const HttpErrorHandler = require('../httpErrorHandler')

class Middlewares {
  /**
   * Configure middlewares of application.<br>
   * Warning: middleware are ordered!
   */
  static init (app) {
    app.use(bodyParser.json())
    expressBusboy.extend(app)
    app.use(hestiaa.middleware.LoggingHandler.getHandler())
    app.use(hestiaa.middleware.UserTokenMiddleware.getHandler())
    Router.register(
      (method, path, action) => {app[method](path, hestiaa.http.HttpResponseBuilder.buildResponse(action))},
      app
    )
    app.use(HttpErrorHandler.handle)
    app.use(hestiaa.middleware.LoggingHandler.getErrorHandler())
  }
}

module.exports = Middlewares
