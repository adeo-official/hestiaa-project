const describeUnit = require('./describeUnit')
const expect = require('expect.js')

describeUnit('Hello', function () {
  it('world!', () => {
    expect(1).to.be(1)
  })
})
