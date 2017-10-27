const expect = require('expect.js')
const request = require('hestiaa').test.apiRequest
const describeApi = require('./describeApi')

describeApi('<root>', function () {
  describe('GET /', function () {
    it('Should return swagger specification', function (done) {
      request.get('/', function (err, res, body) {
        expect(res.statusCode).to.equal(200)
        done(err)
      })
    })
  })
})
