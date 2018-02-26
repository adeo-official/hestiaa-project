const hestiaa = require('hestiaa')
const BoxValidator = require('./boxValidator')
const Product = require('./product')
const Entity = hestiaa.model.Entity
const rootTraceabilityPlugin = hestiaa.utils.mongoritoUtils.rootTraceabilityPlugin

/**
 * @swagger
 * definitions:
 *   Box:
 *     type: object
 *     required: [title]
 *     properties:
 *       _id:
 *         readOnly: true
 *         type: string
 *         format: uuid
 *         description: |
 *           Unique identifier (`ObjectId`).
 *           Generated automatically during creation.
 *         example: '507f1f77bcf86cd799439011'
 *       title:
 *         type: string
 *         description: The title of box.
 *         example: Utils pack for dummies
 *       products:
 *         type: array
 *         items:
 *           $ref: '#/definitions/Product'
 */
class Box extends Entity {
  __getValidator () {
    return new BoxValidator()
  }
}

Box.embeds('products', Product)

Box.use(rootTraceabilityPlugin)

module.exports = Box
