const express = require('express')
const Bootstrap = require('./lib/bootstrap')

Bootstrap.init() // await

let app = express()
let server = Bootstrap.run(app)

module.exports = server
