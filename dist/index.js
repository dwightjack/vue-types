'use strict';

exports.__esModule = true;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VuePropTypes = {

  get any() {
    return (0, _utils.toType)({
      type: null
    });
  },

  get func() {
    return (0, _utils.toType)({
      type: Function,
      default: _utils.noop
    });
  },

  get bool() {
    return (0, _utils.toType)({
      type: Boolean,
      default: true
    });
  },

  get string() {
    return (0, _utils.toType)({
      type: String,
      default: ''
    });
  },

  get number() {
    return (0, _utils.toType)({
      type: Number,
      default: 0
    });
  },

  get array() {
    return (0, _utils.toType)({
      type: Array,
      default: Array
    });
  },

  get object() {
    return (0, _utils.toType)({
      type: Object,
      default: Object
    });
  },

  get integer() {
    return (0, _utils.toType)({
      type: Number,
      validator: function validator(value) {
        return Number.isInteger(value);
      },

      default: 0
    });
  },

  custom: function custom(validator) {
    if (typeof validator !== 'function') {
      throw new TypeError('You must provide a function as argument');
    }

    return (0, _utils.toType)({
      validator: validator
    });
  },
  oneOf: function oneOf(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument');
    }

    return this.custom(function (value) {
      return arr.indexOf(value) !== -1;
    });
  },
  instanceOf: function instanceOf(instanceConstructor) {
    return (0, _utils.toType)({
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument');
    }

    var nativeChecks = arr.map(function (type) {
      if ((0, _lodash2.default)(type)) {
        if (type.type && !(0, _utils.isFunction)(type.validator)) {
          return type.type;
        }
        return null;
      }
      return type;
    }).filter(function (type) {
      return !!type;
    });

    if (nativeChecks.length === arr.length) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return (0, _utils.toType)({
        type: nativeChecks
      });
    }

    return this.custom(function (value) {
      return arr.some(function (type) {
        return (0, _utils.validateType)(type, value);
      });
    });
  },
  arrayOf: function arrayOf(type) {
    return (0, _utils.toType)({
      type: Array,
      validator: function validator(values) {
        return values.every(function (value) {
          return (0, _utils.validateType)(type, value);
        });
      }
    });
  },
  objectOf: function objectOf(type) {
    return (0, _utils.toType)({
      type: Object,
      validator: function validator(obj) {
        return Object.keys(obj).every(function (key) {
          return (0, _utils.validateType)(type, obj[key]);
        });
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    return this.custom(function (value) {
      if (!(0, _lodash2.default)(value)) {
        return false;
      }
      return Object.keys(value).every(function (key) {
        if (keys.indexOf(key) === -1) {
          return false;
        }
        var type = obj[key];
        return (0, _utils.validateType)(type, value[key]);
      });
    });
  }
};

exports.default = VuePropTypes;
module.exports = exports['default'];