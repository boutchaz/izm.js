const Ajv = require('ajv');
const debug = require('debug')('boilerplate:helpers:utils:env:field');

const ajv = new Ajv();

/**
 * Represents a field
 * @class Field
 * @access private
 */
class GenericField {
  constructor({
    key,
    name = key,
    scope = 'general',
    description = '',
    defaultValue,
  }, schema = { type: 'string' }) {
    this.scope = scope;
    this.key = key;
    this.name = name || key;
    this.description = description || '';
    this.schema = schema;
    this.validator = ajv.compile(schema);

    if (typeof defaultValue !== 'undefined') {
      this.defaultValue = defaultValue;
      this.setValue(this.defaultValue);
    }
  }

  /**
   * Get the real environment key from a basic key
   * @param {String} key basic key
   * @param {String} scope The namespace
   */
  realKey() {
    const { scope = 'general', key } = this;
    return scope === 'general' ? key : `${scope.toUpperCase()}_MODULE_${key}`;
  }

  /**
   * Validate field value
   * @param {any} value the value to validate
   */
  validate(value) {
    const isValid = this.validator(value);
    if (!isValid) {
      debug(`Warning: Invalid field value
KEY         : ${this.key}
NAME        : ${this.name}
VALUE       : ${value}
SCOPE       : ${this.scope}
DESCRIPTION : ${this.description}
ERRORS      : ${JSON.stringify(this.validate.errors, null, '  ')}
`);
    }

    return isValid;
  }

  /**
   * Set the value of the current field
   * @param {any} value The new value
   * @chainable
   */
  setValue(value, isForce = false) {
    if (typeof value === 'undefined') {
      this.value = this.defaultValue;
      return this;
    }

    const isValid = this.validate(value);

    if (!isValid && isForce !== true) {
      throw this.validate.errors;
    }

    this.value = value;
    return this;
  }

  /**
   * Get the current value
   * @returns {any} current value
   * @chainable
   */
  getValue() {
    return this.value;
  }

  /**
   * Get JSON format of the field
   * @returns {Object} JSON format of the current field
   */
  toJSON() {
    return {
      key: this.key,
      envVar: this.realKey(),
      name: this.name,
      value: this.getValue(),
      schema: this.schema,
      description: this.description,
      defaultValue: this.defaultValue,
    };
  }

  /**
   * @returns {String} the json format of the current field
   */
  toString() {
    if (typeof this.value === 'undefined' || this.value === null) {
      return undefined;
    }

    return this.value.toString();
  }
}

module.exports = GenericField;
