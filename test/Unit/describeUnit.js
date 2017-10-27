let Bootstrap = require('../../lib/bootstrap')

/**
 * Wraps the setup necessary to run Unit tests. It will set some env vars,
 * initialize the bootstrap and then execute the callable once it's ready.
 *
 * This is basically a helper to make Unit tests easier to write and read.
 * @example
 *   describeUnit('MyClass', function () {
 *     describe('classBehavior', function () {
 *       it('should work', function () {
 *         // assertion
 *       })
 *     })
 *   })
 *
 * @param  {string}   name     Name of what is being described/tested
 * @param  {function} callable Test function
 */
function describeUnit (name, callable) {
  // Set testing environment variables
  before(function () {
    process.env.NODE_ENV = 'testing'
    process.env.MONGO_DB = `${process.env.MONGO_DB}_test`
    process.env.DISABLE_DB = 'true'
    Bootstrap.init()
  })

  // Describe provided specs
  describe(name, callable)
}

module.exports = describeUnit
