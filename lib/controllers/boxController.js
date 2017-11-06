const ObjectId = require('mongorito').ObjectId
const ResourceNotFoundError = require('hestiaa').errors.ResourceNotFoundError
const ValidationError = require('hestiaa').errors.ValidationError
const Box = require('../model/box')

class BoxController {
  /**
   * @swagger
   * /hestiaa/boxe:
   *   post:
   *     tags: [hestiaa]
   *     description: Create new `Box` from base information.
   *     security:
   *       - APIToken: []
   *     produces:
   *       - application/json
   *     parameters:
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Box'
   *         description: The `Box` entity to create.
   *     responses:
   *       200:
   *         description: The `Box` created successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               $ref: '#/definitions/Box'
   *             errors:
   *               type: array
   *               items:
   *                 type: object
   *               description: An empty array (always when success).
   *               example: []
   *       400:
   *         description: |
   *           Invalid input data.
   *           Unexpected fields.
   *         schema:
   *           $ref: '#/definitions/Error'
   *
   * @param {http.request} req
   * @return {Promise<Box>}
   */
  static async create (req) {
    if (req.body._id) {
      throw new ValidationError('Invalid input field _id')
    }
    let errors = Box.embeddedModels.map(m => m.key).filter(guarded => req.body[guarded]).map(guarded => `Unexpected input field ${guarded}`)
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    let box = new Box(req.body)
    await box.save()
    return box
  }

  /**
   * @swagger
   * /hestiaa/box:
   *   get:
   *     tags: [hestiaa]
   *     description: Retrieves the list of all `Box`s.
   *     security:
   *       - APIToken: []
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The list of `Box`s.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               type: array
   *               items:
   *                 $ref: '#/definitions/Box'
   *             errors:
   *               type: array
   *               items:
   *                 type: object
   *               description: An empty array (always when success).
   *               example: []
   *
   * @param {http.request} req
   * @return {Promise<Array<Box>>}
   */
  static async findAll (req) {
    return Box.find()
  }

  /**
   * @swagger
   * /hestiaa/box/{id}:
   *   get:
   *     tags: [hestiaa]
   *     description: Find `Box`s by ID.
   *     security:
   *       - APIToken: []
   *     parameters:
   *       - in: path
   *         name: id
   *         type: string
   *         required: true
   *         description: Id of the `Box` to find.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The found `Box`.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               $ref: '#/definitions/Box'
   *             errors:
   *               type: array
   *               items:
   *                 type: object
   *               description: An empty array (always when success).
   *               example: []
   *       404:
   *         description: Non-existent `Box`.
   *         schema:
   *           $ref: '#/definitions/NotFound'
   *
   * @param {http.request} req
   * @return {Promise<Array<Box>>}
   */
  static async findById (req) {
    let box = await Box.findOne({_id: ObjectId(req.params.id)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }
    return box
  }

  /**
   * @swagger
   * /hestiaa/box/{id}:
   *   put:
   *     tags: [hestiaa]
   *     description: |
   *       Update base fields of a `Box`.
   *       **Important:** Embedded fields are not accepted. You have to use dedicated sub-webservices.
   *     security:
   *       - APIToken: []
   *     parameters:
   *       - in: path
   *         name: id
   *         type: string
   *         required: true
   *         description: Id of the `Box` to update.
   *       - in: body
   *         name: body
   *         required: true
   *         schema:
   *           $ref: '#/definitions/Box'
   *         description: The `Box` entity to update.
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The `Box` updated successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               $ref: '#/definitions/Box'
   *             errors:
   *               type: array
   *               items:
   *                 type: object
   *               description: An empty array (always when success).
   *               example: []
   *       404:
   *         description: Non-existent `Box`.
   *         schema:
   *           $ref: '#/definitions/NotFound'
   *       400:
   *         description: |
   *           Invalid input data.
   *           Unexpected fields.
   *         schema:
   *           $ref: '#/definitions/Error'
   *
   * @param {http.request} req
   * @return {Promise<Box>}
   */
  static async update (req) {
    let errors = Box.embeddedModels.map(m => m.key).filter(guarded => req.body[guarded]).map(guarded => `Unexpected input field ${guarded}`)
    if (errors.length > 0) {
      throw new ValidationError(errors)
    }

    // optional body "_id" field
    if (req.body._id && req.body._id !== req.params.id) {
      throw new ValidationError('body _id field is different from URL path parameter')
    }
    req.body._id = ObjectId(req.params.id)

    let box = await Box.findOne({_id: ObjectId(req.params.id)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }

    box = new Box(req.body)
    await box.save()

    return box
  }

  /**
   * @swagger
   * /hestiaa/box/{id}:
   *   delete:
   *     tags: [hestiaa]
   *     description: Deletes an existing `Box`
   *     security:
   *       - APIToken: []
   *     parameters:
   *       - in: path
   *         name: id
   *         type: string
   *         required: true
   *         description: Id of the `Box` to delete
   *     produces:
   *       - application/json
   *     responses:
   *       200:
   *         description: The `Box` deleted successfully.
   *         schema:
   *           type: object
   *           properties:
   *             status:
   *               type: string
   *               example: success
   *             data:
   *               example: null
   *             errors:
   *               type: array
   *               items:
   *                 type: object
   *               description: An empty array (always when success).
   *               example: []
   *       404:
   *         description: Non-existent `Box`.
   *         schema:
   *           $ref: '#/definitions/NotFound'
   *
   * @param {http.request} req
   * @return {Promise<null>}
   */
  static async delete (req) {
    let box = await Box.findOne({_id: ObjectId(req.params.id)})
    if (!box) {
      throw new ResourceNotFoundError('Box')
    }

    await box.remove()
  }
}

module.exports = BoxController
