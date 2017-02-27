'use strict';

exports.__esModule = true;

var _lodash = require('lodash.isplainobject');

var _lodash2 = _interopRequireDefault(_lodash);

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VuePropTypes = {

  get any() {
    return (0, _utils.toType)({
      type: null,
      name: 'any'
    });
  },

  get func() {
    return (0, _utils.toType)({
      type: Function,
      name: 'function',
      default: _utils.noop
    });
  },

  get bool() {
    return (0, _utils.toType)({
      type: Boolean,
      name: 'boolean',
      default: true
    });
  },

  get string() {
    return (0, _utils.toType)({
      type: String,
      name: 'string',
      default: ''
    });
  },

  get number() {
    return (0, _utils.toType)({
      type: Number,
      name: 'number',
      default: 0
    });
  },

  get array() {
    return (0, _utils.toType)({
      type: Array,
      name: 'array',
      default: Array
    });
  },

  get object() {
    return (0, _utils.toType)({
      type: Object,
      name: 'object',
      default: Object
    });
  },

  get integer() {
    return (0, _utils.toType)({
      type: Number,
      name: 'integer',
      validator: function validator(value) {
        return (0, _utils.isInteger)(value);
      },

      default: 0
    });
  },

  custom: function custom(validatorFn) {
    var warnMsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'custom validation failed';

    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument');
    }

    return (0, _utils.toType)({
      name: validatorFn.name || '<<anonymous function>>',
      validator: function validator() {
        var valid = validatorFn.apply(undefined, arguments);
        if (!valid) (0, _utils.warn)(warnMsg);
        return valid;
      }
    });
  },
  oneOf: function oneOf(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }
    var msg = 'value should be one of "' + arr.join('", "') + '"';
    var allowedTypes = arr.reduce(function (ret, v) {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor);
      }
      return ret;
    }, []);

    return (0, _utils.toType)({
      name: 'oneOf',
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator: function validator(value) {
        var valid = arr.indexOf(value) !== -1;
        if (!valid) (0, _utils.warn)(msg);
        return valid;
      }
    });
  },
  instanceOf: function instanceOf(instanceConstructor) {
    return (0, _utils.toType)({
      name: 'instanceOf',
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }

    var hasCustomValidators = false;

    var nativeChecks = arr.reduce(function (ret, type, i) {
      if ((0, _lodash2.default)(type)) {
        if (type.name === 'oneOf') {
          return ret.concat(type.type || []);
        }
        if (type.type && !(0, _utils.isFunction)(type.validator)) {
          if ((0, _utils.isArray)(type.type)) return ret.concat(type.type);
          ret.push(type.type);
        } else if ((0, _utils.isFunction)(type.validator)) {
          hasCustomValidators = true;
        }
        return ret;
      }
      ret.push(type);
      return ret;
    }, []);

    if (!hasCustomValidators) {
      // we got just native objects (ie: Array, Object)
      // delegate to Vue native prop check
      return (0, _utils.toType)({
        name: 'oneOfType',
        type: nativeChecks
      });
    }

    var typesStr = arr.map(function (type) {
      if (type && (0, _utils.isArray)(type.type)) {
        return type.type.map(_utils.getType);
      }
      return (0, _utils.getType)(type);
    }).reduce(function (ret, type) {
      return ret.concat((0, _utils.isArray)(type) ? type : [type]);
    }, []).join('", "');

    return this.custom(function oneOfType(value) {
      var valid = arr.some(function (type) {
        if (type.name === 'oneOf') {
          return type.type ? (0, _utils.validateType)(type.type, value, true) : true;
        }
        return (0, _utils.validateType)(type, value, true);
      });
      if (!valid) (0, _utils.warn)('value type should be one of "' + typesStr + '"');
      return valid;
    });
  },
  arrayOf: function arrayOf(type) {
    return (0, _utils.toType)({
      name: 'arrayOf',
      type: Array,
      validator: function validator(values) {
        var valid = values.every(function (value) {
          return (0, _utils.validateType)(type, value);
        });
        if (!valid) (0, _utils.warn)('value must be an array of \'' + (0, _utils.getType)(type) + '\'');
        return valid;
      }
    });
  },
  objectOf: function objectOf(type) {
    return (0, _utils.toType)({
      name: 'objectOf',
      type: Object,
      validator: function validator(obj) {
        var valid = Object.keys(obj).every(function (key) {
          return (0, _utils.validateType)(type, obj[key]);
        });
        if (!valid) (0, _utils.warn)('value must be an object of \'' + (0, _utils.getType)(type) + '\'');
        return valid;
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    var requiredKeys = keys.filter(function (key) {
      return obj[key] && obj[key].required === true;
    });

    var type = (0, _utils.toType)({
      name: 'shape',
      type: Object,
      validator: function validator(value) {
        var _this = this;

        if (!(0, _lodash2.default)(value)) {
          return false;
        }
        var valueKeys = Object.keys(value);

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
          return valueKeys.indexOf(req) === -1;
        })) {
          (0, _utils.warn)('at least one of required properties "' + requiredKeys.join('", "') + '" is not present');
          return false;
        }

        return valueKeys.every(function (key) {
          if (keys.indexOf(key) === -1) {
            if (_this.isLoose === true) return true;
            (0, _utils.warn)('object is missing "' + key + '" property');
            return false;
          }
          var type = obj[key];
          return (0, _utils.validateType)(type, value[key]);
        });
      }
    });

    Object.defineProperty(type, 'loose', {
      get: function get() {
        var t = (0, _objectAssign2.default)({ isLoose: true }, this);
        (0, _utils.withRequired)(t);
        (0, _utils.withDefault)(t);
        return t;
      },

      enumerable: false
    });

    return type;
  }
};

exports.default = VuePropTypes;
module.exports = exports['default'];