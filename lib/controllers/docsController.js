const fs = require('mz/fs')

class DocsController {
  /**
   * Serves the swagger specification of the API
   * @swagger
   * /:
   *   get:
   *     description: Retrieves swagger especification
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: Swagger specs
   *
   * @param  {http.request}  req
   * @param  {http.response} res
   */
  static async index (req, res) {
    let swaggerSpec = await fs.readFile('resources/swagger.json')
    res.json(JSON.parse(swaggerSpec))
  }
}

module.exports = DocsController
