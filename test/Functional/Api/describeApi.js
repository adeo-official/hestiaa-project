const express = require('express')
const Bootstrap = require('../../../lib/bootstrap')

/**
 * Wraps the setup necessary to run API tests. It will set some env vars,
 * initialize server and then executes the callable.
 *
 * This is basically a helper to make Api tests easier to write and read.
 * @example
 *   describeApi('MyTest', function () {
 *     describe('subTest', function () {
 *       it('should work', function () {
 *         // assertion
 *       })
 *     })
 *   })
 *
 * @param  {string}   name     Name of what is being described/tested
 * @param  {function} callable Test function
 */
function describeApi (name, callable) {
  let server

  // Set testing environment variables
  // and bootstrap the application server
  before(async () => {
    process.env.NODE_ENV = 'testing'
    process.env.MONGO_DB = `${process.env.MONGO_DB}_test`
    await Bootstrap.init()
    process.env.PORT = parseInt(process.env.PORT) + 700
    server = Bootstrap.run(express())
  })

  // Close http server after tests
  after(async () => {
    await server.close()
  })

  // Describe provided specs
  describe(`API ${name}`, callable)
}

module.exports = describeApi
