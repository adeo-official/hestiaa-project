const describeApi = require('./describeApi')
const request = require('hestiaa').test.apiRequest
const helper = require('./../../hestiaa_helpers')
const expect = require('expect.js')
const ObjectId = require('mongorito').ObjectId
const Box = require('../../../lib/model/box')

describeApi('hestiaa/box', () => {
  let box
  let boxId

  before('initialize MongoDb', async () => {
    let collection = await Box.getCollection()
    try {
      await collection.drop()
    } catch (error) {}
  })

  beforeEach('initialize Box', async () => {
    box = new Box({
      title: 'test'
    })
    await box.save()
    boxId = box.get('_id').toString()
  })

  let initialCount
  beforeEach('initialize Box.count()', async () => {
    initialCount = await Box.count()
  })

  describe('POST /hestiaa/box', () => {
    let generatePayload = () => {
      return {
        title: 'new'
      }
    }

    it('Should create entity', done => {
      let payload = generatePayload()
      request.post(`/hestiaa/box`, {json: payload, headers: helper.headers()}, async (err, res, json) => {
        // response
        expect(res.statusCode).to.equal(200)
        expect(json.data._id).to.not.be(undefined)
        expect(json.data.title).to.be(payload.title)

        // database
        expect(await Box.count()).to.be(initialCount + 1)
        let createdBox = await Box.findOne({_id: ObjectId(json.data._id)})
        expect(createdBox.get('title')).to.be(payload.title)

        done(err)
      })
    })

    describe('Should throw 400 if payload', () => {
      it('contains invalid base field', done => {
        let payload = {}
        request.post(`/hestiaa/box`, {json: payload, headers: helper.headers()}, (err, res) => {
          expect(res.statusCode).to.equal(400)
          done(err)
        })
      })

      it('contains unexpected embedded field', done => {
        let payload = Object.assign(generatePayload(), {products: []})
        request.post(`/hestiaa/box`, {json: payload, headers: helper.headers()}, (err, res) => {
          expect(res.statusCode).to.equal(400)
          done(err)
        })
      })
    })
  })

  describe('GET /hestiaa/box', () => {
    it('Should return all entities', done => {
      request.get(`/hestiaa/box`, {headers: helper.headers()}, (err, res) => {
        let json = JSON.parse(res.body)

        // response
        expect(res.statusCode).to.equal(200)
        json = json.data.find(pt => pt._id === boxId) // check data from "beforeEach()"
        expect(json._id).to.be(box.get('_id').toString())
        expect(json.title).to.be(box.get('title'))

        done(err)
      })
    })
  })

  describe('GET /hestiaa/box/:id', () => {
    it('Should return the entity', done => {
      request.get(`/hestiaa/box/${boxId}`, {headers: helper.headers()}, (err, res) => {
        let json = JSON.parse(res.body)

        // response
        expect(res.statusCode).to.equal(200)
        expect(json.data._id).to.be(box.get('_id').toString())
        expect(json.data.title).to.be(box.get('title'))

        done(err)
      })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      request.get(`/hestiaa/box/${boxId}`, {headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })
  })

  describe('PUT /hestiaa/box/:id', () => {
    let generatePayload = () => {
      return {
        title: 'update'
      }
    }

    it('Should update entity', done => {
      let payload = generatePayload()
      request.put(`/hestiaa/box/${boxId}`, {json: payload, headers: helper.headers()}, async (err, res, json) => {
        // response
        expect(res.statusCode).to.equal(200)
        expect(json.data._id).to.be(boxId)
        expect(json.data.title).to.be(payload.title)

        // database
        let updatedBox = await Box.findOne({_id: ObjectId(boxId)})
        expect(updatedBox.get('title')).to.be(payload.title)

        done(err)
      })
    })

    describe('Should throw 400 if payload', () => {
      it('contains invalid base field', done => {
        let payload = {}
        request.put(`/hestiaa/box/${boxId}`, {json: payload, headers: helper.headers()}, (err, res) => {
          expect(res.statusCode).to.equal(400)
          done(err)
        })
      })

      it('contains unexpected embedded field', done => {
        let payload = Object.assign(generatePayload(), {products: []})
        request.put(`/hestiaa/box/${boxId}`, {json: payload, headers: helper.headers()}, (err, res) => {
          expect(res.statusCode).to.equal(400)
          done(err)
        })
      })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      let payload = generatePayload()
      request.put(`/hestiaa/box/${boxId}`, {json: payload, headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })
  })

  describe('DELETE /hestiaa/box/:id', () => {
    it('Should delete entity', done => {
      request.delete(`/hestiaa/box/${boxId}`, {headers: helper.headers()}, async (err, res) => {
        expect(res.statusCode).to.equal(200)
        expect(await Box.findOne({_id: ObjectId(boxId)})).to.be(null)
        done(err)
      })
    })

    it('Should throw 404 if Box not found', done => {
      let boxId = '000000000000000000000000'
      request.delete(`/hestiaa/box/${boxId}`, {headers: helper.headers()}, (err, res) => {
        expect(res.statusCode).to.equal(404)
        done(err)
      })
    })
  })
})
