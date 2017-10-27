let Mongorito = require('mongorito')

class Database {
  static init () {
    let db = new Mongorito(this.getConnectionString())

    if (process.env.DISABLE_DB === 'true') {
      return
    }
    // db.connect()
  }

  static getConnectionString () {
    let connectionString = `${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`

    if (typeof process.env.MONGO_PASSWORD && process.env.MONGO_PASSWORD.length > 1) {
      return `${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${connectionString}`
    }

    return connectionString
  }
}

module.exports = Database
