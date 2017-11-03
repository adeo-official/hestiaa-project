const Mongorito = require('mongorito')

class Database {
  /**
   * Register Mongorito entities
   * @see  https://github.com/vadimdemedes/mongorito#creating-a-model
   * @param  {Mongorito} db Mongorito instance used to register entities
   */
  static registerEntities (db) {
    /**
     * Use this method to register Mongorito entities. See the example bellow
     */

    // db.register(MyEntity)
  }

  /**
   * Initializes database connection
   */
  static async init () {
    let db = new Mongorito(this.getConnectionString())

    this.registerEntities(db)

    if (process.env.DISABLE_DB === 'true') {
      return
    }

    try {
      await db.connect()
    } catch (err) {
      err.message = `Unable to connect to database. Please check connectivity. ${err.message}`
      throw err
    }
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
