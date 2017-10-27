const express = require('express')
const Bootstrap = require('./lib/bootstrap')

Bootstrap.init()

let app = express()
let server = Bootstrap.run(app)

module.exports = server
