/**
 * Temporary controller.
 *
 * @swagger
 * tags:
 *   - name: package-management
 *     description: Regarding the Package-Management related resources
 */
class HelloWorldController {
  /**
   * Temporary entry-point.
   * @swagger
   * /hestiaa-project/hello-world:
   *   get:
   *     description: Say hello.
   *     tags: [hestiaa-project]
   *     security:
   *     - APIToken: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The message to display.
   *
   * @param {http.request} req
   * @param {http.response} res
   */
  static async sayHello (req) {
    return Promise.resolve('Hello world!')
  }
}

module.exports = HelloWorldController
