const describeApi = require('./describeApi')
const expect = require('expect.js')
const request = require('hestiaa').test.apiRequest

describeApi('GET /', function () {
  it('Should return swagger specification', function (done) {
    request.get('/', function (err, res) {
      expect(res.statusCode).to.equal(200)
      done(err)
    })
  })
})
