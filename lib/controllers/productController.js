const ObjectId = require('mongorito').ObjectId
const ResourceNotFoundError = require('hestiaa').errors.ResourceNotFoundError
const ValidationError = require('hestiaa').errors.ValidationError
const Box = require('../model/box')
const Product = require('../model/product')

class ProductController {
  /**
   * @swagger
   * /hestiaa/box/{boxId}/product:
   *   post:
   *     description: Create new `Product` from base information.
   *     tags: [hestiaa]
   *     security:
   *       - APIToken: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: path
   *         name: boxId
   *         description: Id of the `Box` in which the `Product` is to be added.
   *         type: string
   *         required: true
   *       - in: body
   *         name: body
   *         description: The `Product` entity to create.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Product'
   *     responses:
   *       200:
   *         description: The `Product` created successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               $ref: '#/definitions/Product'
   *             errors:
   *               description: An empty array (always when success).
   *               type: array
   *               items:
   *                 type: object
   *               example: []
   *       400:
   *         description: Invalid input data.
   *         schema:
   *           $ref: '#/definitions/Error'
   *
   * @param {http.request} req
   * @return {Promise<Product>}
   */
  static async create (req) {
    let box = await Box.findOne({_id: ObjectId(req.params.boxId)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }

    if (req.body._id) {
      throw new ValidationError('Invalid input field _id')
    }

    let product = new Product(req.body)
    await box.embed('products', product)
    await box.save()

    return product
  }

  /**
   * @swagger
   * /hestiaa/box/{boxId}/product/{id}:
   *   put:
   *     description: Updates an existing `Product`, in parent `Box`.
   *     tags: [hestiaa]
   *     security:
   *       - APIToken: []
   *     parameters:
   *       - in: path
   *         name: boxId
   *         description: Id of the `Box` in which the `Product` is to be updated.
   *         type: string
   *         required: true
   *       - in: path
   *         name: id
   *         description: Id of the `Product` to update.
   *         type: string
   *         required: true
   *       - in: body
   *         name: body
   *         description: The `Product` entity to update.
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Product'
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The `Product` updated successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               $ref: '#/definitions/Product'
   *             errors:
   *               description: An empty array (always when success).
   *               type: array
   *               items:
   *                 type: object
   *               example: []
   *       400:
   *         description: Invalid input data.
   *         schema:
   *           $ref: '#/definitions/Error'
   *       404:
   *         description: Non-existent `Box` or `Product`.
   *         schema:
   *           $ref: '#/definitions/NotFound'
   *
   * @param {http.request} req
   * @return {Promise<Product>}
   */
  static async update (req) {
    let box = await Box.findOne({_id: ObjectId(req.params.boxId)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }

    // optional body "_id" field
    if (req.body._id && req.body._id !== req.params.id) {
      throw new ValidationError('body _id field is different from URL path parameter')
    }
    req.body._id = ObjectId(req.params.id)

    let product = new Product(req.body)
    await box.embed('products', product)
    await box.save()

    return product
  }

  /**
   * @swagger
   * /hestiaa/box/{boxId}/product/{id}:
   *   delete:
   *     description: Deletes an existing `Product`, in parent `Box`.
   *     tags: [hestiaa]
   *     security:
   *       - APIToken: []
   *     parameters:
   *       - in: path
   *         name: boxId
   *         type: string
   *         required: true
   *         description: Id of the `Box` in which the `Product` is to be deleted.
   *       - in: path
   *         name: id
   *         type: string
   *         required: true
   *         description: Id of the `Product` to delete.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The `Product` deleted successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               example: null
   *             errors:
   *               description: An empty array (always when success).
   *               type: array
   *               items:
   *                 type: object
   *               example: []
   *       404:
   *         description: Non-existent `Box` or `Product`.
   *         schema:
   *           $ref: '#/definitions/NotFound'
   *
   * @param {http.request} req
   * @return {Promise<null>}
   */
  static async delete (req) {
    let box = await Box.findOne({_id: ObjectId(req.params.boxId)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }

    let product = await box.unembed('products', new Product({_id: ObjectId(req.params.id)}))
    if (!product) {
      throw new ResourceNotFoundError('Product')
    }

    await box.save()
    return null
  }
}

module.exports = ProductController
