const dotenv = require('dotenv-safe')
const Database = require('./bootstrap/database')
const Middlewares = require('./bootstrap/middlewares')

/**
 * This class have the responsability of initializing the web application.
 */
class Bootstrap {
  /**
   * Prepares to initialize the application
   */
  static async init () {
    dotenv.config({allowEmptyValues: true})
    await Database.init()
  }

  /**
   * Serves the express application
   *
   * @param  {object} app Express instance
   * @return {http.server} Http server instance
   */
  static run (app) {
    Middlewares.init(app)

    app.disable('etag')

    return app.listen(process.env.PORT, function () {
      if (process.env.NODE_ENV !== 'testing') {
        console.log('Example app listening on port ' + process.env.PORT)
      }
    })
  }
}

module.exports = Bootstrap
