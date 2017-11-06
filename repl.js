const Bootstrap = require('./lib/bootstrap')
const path = require('path')
const repl = require('repl')
const awaitOutside = require('await-outside')
const glob = require('glob')

/**
 * Bootstrap the application (.env, database connection, etc)
 * @see ./lib/bootstrap
 */
Bootstrap.init() // await
const prompt = `${path.resolve().split(path.sep).pop()} > `

/**
 * Initialize an REPL
 * @see Build Your Own App Specific REPL For Your NodeJS App (Article)
 */
var replServer = repl.start({prompt})

/**
 * Add 'await' support
 */
awaitOutside.addAwaitOutsideToReplServer(replServer)

/**
 * Load common modules for quicker usage :)
 */
glob('./lib/*/**/*.js', function (err, modules) {
  if (err) {
    console.error(err)
  }

  console.log(`bootstraping...`)

  for (var i = 0; i < modules.length; i++) {
    let module = modules[i]
    let file = module.match(/\/(\w*)\.js$/)[1]
    let moduleName = file.charAt(0).toUpperCase() + file.slice(1)

    console.log(`  ${moduleName} = require(...)`)
    replServer.context[moduleName] = require(module)
  }

  process.stdout.write(`\n${prompt}`)
})
