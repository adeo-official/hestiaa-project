const describeApi = require('./describeApi')
const request = require('hestiaa').test.apiRequest
const expect = require('expect.js')
const jwt = require('jsonwebtoken')

describeApi('hestiaa-project/hello-world', function () {
  var token = jwt.sign({
    sub: 'login',
    iss: 'users ms',
    user: '507f1f77bcf86cd799439011'
  }, process.env.APP_KEY)

  it('should say hello world properly', function (done) {
    request.get(`/hestiaa-project/hello-world`, {headers: {authorization: token}}, function (err, res, json) {
      console.log(json)
      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(json).data).to.be('Hello world!')
      done(err)
    })
  })
})
