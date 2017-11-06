const describeApi = require('./describeApi')
const request = require('hestiaa').test.apiRequest
const helper = require('./../../hestiaa_helpers')
const expect = require('expect.js')
const ObjectId = require('mongorito').ObjectId
const Box = require('../../../lib/model/box')
const Product = require('../../../lib/model/product')

describeApi('hestiaa/product', () => {
  let box
  let boxId
  let product
  let productId

  before('initialize MongoDb', async () => {
    let collection = await Box.getCollection()
    try {
      await collection.drop()
    } catch (error) {}
  })

  before('initialize Box', async () => {
    box = new Box({
      title: 'any'
    })
    await box.save()
    boxId = box.get('_id').toString()
  })

  beforeEach('initialize Product', async () => {
    product = new Product({
      name: 'test',
      type: 'tools'
    })
    await box.embed('products', product)
    await box.save()
    productId = product.get('_id').toString()
  })

  let initialCount
  // separated because Mocha doesn't support async+done
  beforeEach('initialize Box.count()', async () => {
    initialCount = (await Box.findOne({_id: ObjectId(boxId)})).get('products').length
  })

  describe('POST /hestiaa/box/:boxId/product', () => {
    let payload = {
      name: 'new',
      type: 'other'
    }

    it('Should create entity', done => {
      request.post(`/hestiaa/box/${boxId}/product`, {json: payload, headers: helper.headers()},
        async (err, res, json) => {
          // response
          expect(res.statusCode).to.equal(200)
          expect(json.data._id).to.not.be(undefined)
          expect(json.data.name).to.be(payload.name)
          expect(json.data.type).to.be(payload.type)

          // database
          let updatedBox = await Box.findOne({_id: ObjectId(boxId)})
          expect(updatedBox.get('products').length).to.be(initialCount + 1)
          let createdProduct = updatedBox.getEmbeded('products', json.data._id)
          expect(createdProduct.get('name')).to.be(payload.name)
          expect(createdProduct.get('type')).to.be(payload.type)

          done(err)
        })
    })

    it('Should throw 400 if payload is invalid', done => {
      let payload = {}
      request.post(`/hestiaa/box/${boxId}/product`, {json: payload, headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(400)
        done(err)
      })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      request.post(`/hestiaa/box/${boxId}/product`, {json: payload, headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })
  })

  describe('PUT /hestiaa/box/:boxId/product/:id', () => {
    let generatePayload = () => {
      return {
        name: 'update',
        type: 'materials'
      }
    }

    it('Should update entity', done => {
      let payload = generatePayload()
      request.put(`/hestiaa/box/${boxId}/product/${productId}`, {json: payload, headers: helper.headers()},
        async (err, res, json) => {
          // response
          expect(res.statusCode).to.equal(200)
          expect(json.data._id).to.be(productId)
          expect(json.data.name).to.be(payload.name)
          expect(json.data.type).to.be(payload.type)

          // database
          let updatedProduct = (await Box.findOne({_id: ObjectId(boxId)})).getEmbeded('products', productId)
          expect(updatedProduct.get('name')).to.be(payload.name)
          expect(updatedProduct.get('type')).to.be(payload.type)

          done(err)
        })
    })

    it('Should throw 400 if payload is invalid', done => {
      let payload = {}
      request.put(`/hestiaa/box/${boxId}/product/${productId}`, {json: payload, headers: helper.headers()},
        (err, res) => {
          expect(res.statusCode).to.equal(400)
          done(err)
        })
    })

    it('Should throw 404 if Product not found', done => {
      let productId = '000000000000000000000000'
      let payload = generatePayload()
      request.put(`/hestiaa/box/${boxId}/product/${productId}`, {json: payload, headers: helper.headers()},
        (err, res) => {
          expect(res.statusCode).to.equal(404)
          done(err)
        })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      let payload = generatePayload()
      request.put(`/hestiaa/box/${boxId}/product/${productId}`, {json: payload, headers: helper.headers()},
        (err, res) => {
          expect(res.statusCode).to.equal(404)
          done(err)
        })
    })
  })

  describe('DELETE /hestiaa/box/:boxId/product/:id', () => {
    it('Should delete entity', done => {
      request.delete(`/hestiaa/box/${boxId}/product/${productId}`, {headers: helper.headers()}, async (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect((await Box.findOne({_id: ObjectId(boxId)})).get('products').length).to.be(initialCount - 1)
        done(err)
      })
    })

    it('Should throw 404 if Product not found', done => {
      let productId = '000000000000000000000000'
      request.delete(`/hestiaa/box/${boxId}/product/${productId}`, {headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      request.delete(`/hestiaa/box/${boxId}/product/${productId}`, {headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })
  })
})
