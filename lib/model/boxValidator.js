const BaseValidator = require('hestiaa').model.BaseValidator

class BoxValidator extends BaseValidator {
  /**
   * @override
   */
  static sanitizations () {
    return {}
  }

  /**
   * @override
   */
  static validations () {
    return {
      '_id': 'objectIdString',
      'title': 'required|string',
      // embedded
      'products': 'array',
      'products.*': 'object'
    }
  }
}

module.exports = BoxValidator
