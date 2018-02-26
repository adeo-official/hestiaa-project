const BaseValidator = require('hestiaa').model.BaseValidator

class ProductValidator extends BaseValidator {
  /**
   * @override
   */
  validations () {
    return {
      '_id': 'objectIdString',
      'name': 'string',
      'type': `required|string|in:${ProductValidator.validTypes().join()}`,
      'brand': 'string'
    }
  }

  static validTypes () {
    return ['other', 'tools', 'materials', 'decoration']
  }
}

module.exports = ProductValidator
