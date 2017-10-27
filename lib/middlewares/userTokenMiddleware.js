const hestiaa = require('hestiaa')

class UserTokenMiddleware extends hestiaa.middleware.UserTokenMiddleware {
  /**
   * List of all routes accessible by user without authentication.
   * URL is a pattern, because of path/query parameters.
   */
  static publicRoutes () {
    return [
      {method: 'GET', urlPattern: '/'} // Swagger specs
    ]
  }
}

module.exports = UserTokenMiddleware
