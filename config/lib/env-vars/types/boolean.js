const GenericField = require('./generic');

/**
 * Boolean field
 */
class BooleanField extends GenericField {
  setValue(value) {
    this.value = !!value;

    return this;
  }
}

module.exports = BooleanField;
