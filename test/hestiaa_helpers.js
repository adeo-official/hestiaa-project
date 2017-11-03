const jwt = require('jsonwebtoken')

// A list of users to use during tests
const USERS = {
  first: '507f1f77bcf86cd799439011',
  second: '598c8be575c9d80029abbf3c',
  non_existing: '59959aef0374212129197d61',
  unauthorized: '5994723c0374216bdc5862f1'
}

/**
 * Generate JWT for the given user id
 * @param {string} userId id of the user we want a JWT for. If no user is given, USERS.first is assumed.
 * @return {string} the complet JWT for that user
 */
USERS.genJwt = function (userId) {
  return jwt.sign({
    sub: 'login',
    iss: 'users ms',
    user: userId || USERS.first
  }, process.env.APP_KEY)
}

module.exports = {
  users: USERS,
  headers: function (userId) {
    return {
      authorization: USERS.genJwt(userId)
    }
  }
}
