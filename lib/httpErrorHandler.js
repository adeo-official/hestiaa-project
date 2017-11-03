const hestiaa = require('hestiaa')
const jwt = require('jsonwebtoken')
const ResourceNotFoundError = hestiaa.errors.ResourceNotFoundError
const ValidationError = hestiaa.errors.ValidationError

/**
 * Handles http errors. Basically the handle function can be used as an express
 * error handler in order to return api complient error messages based in the
 * Errors that may be throwed by the application.
 *
 * @see http://expressjs.com/en/guide/error-handling.html
 *
 * @swagger
 * definitions:
 *   Error:
 *     type: object
 *     properties:
 *       status:
 *         type: string
 *         example: 'error'
 *       data:
 *         description: Always "null" value.
 *         example: null
 *       errors:
 *         type: array
 *         items:
 *           type: string
 *           example: 'X went wrong because of Y'
 *   NotFound:
 *     type: object
 *     properties:
 *       status:
 *         type: string
 *         example: 'error'
 *       data:
 *         description: Always "null" value.
 *         example: null
 *       errors:
 *         type: array
 *         items:
 *           type: object
 *           example: {name: 'ResourceNotFoundError', message: 'resource not found'}
 *   Unauthorized:
 *     type: object
 *     properties:
 *       status:
 *         type: string
 *         example: 'unauthorized'
 *       data:
 *         description: Always "null" value.
 *         example: null
 *       errors:
 *         type: array
 *         items:
 *           type: object
 *           example: {name: 'JsonWebTokenError', message: 'invalid token'}
 */
class HttpErrorHandler {
  static handle (err, req, res, next) {
    err = HttpErrorHandler.encapsulateGenericError(err)

    switch (err.constructor) {
      /**
       * 404 if resource was not found
       */
      case ResourceNotFoundError:
        res.status(404).send({
          status: 'error',
          data: null,
          errors: [err]
        })
        break
      /**
       * 401 in case of JWT error
       */
      case jwt.JsonWebTokenError:
      case jwt.TokenExpiredError:
        res.status(401).send({
          status: 'unauthorized',
          data: null,
          errors: [err]
        })
        break
      /**
       * 400 if there was a validation error
       */
      case ValidationError:
        res.status(400).send({
          status: 'error',
          data: null,
          errors: err.messages
        })
        break
      /**
       * Defaults to 500. Generic server side error
       */
      default:
        res.status(500).send({
          status: 'error',
          data: null,
          errors: [err]
        })
    }
    next(err)
  }

  /**
   * Not all packages and dependencies have friendly and usable exception types.
   * This method's purpose is to wrap those generic errors into more treatable
   * error types
   *
   * @param  {Error} err Generic error
   * @return {Error}     Specific error
   */
  static encapsulateGenericError (err) {
    switch (err.message) {
      case 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters':
        return new ValidationError(
          ['ObjectId (_id) must be a string with 24 hex characters'],
          err.fileName,
          err.lineNumber
        )
      default:
        return err
    }
  }
}

module.exports = HttpErrorHandler
