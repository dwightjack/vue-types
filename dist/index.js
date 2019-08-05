"use strict";

exports.__esModule = true;
exports.default = void 0;

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _utils = require("./utils");

var _sensibles = require("./sensibles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var VueTypes = {
  get any() {
    return (0, _utils.toType)('any', {
      type: null
    }, true);
  },

  get func() {
    return (0, _utils.toType)('function', {
      type: Function
    }, true).def(VueTypes.sensibleDefaults.func);
  },

  get bool() {
    return (0, _utils.toType)('boolean', {
      type: Boolean
    }, true).def(VueTypes.sensibleDefaults.bool);
  },

  get string() {
    return (0, _utils.toType)('string', {
      type: String
    }, true).def(VueTypes.sensibleDefaults.string);
  },

  get number() {
    return (0, _utils.toType)('number', {
      type: Number
    }, true).def(VueTypes.sensibleDefaults.number);
  },

  get array() {
    return (0, _utils.toType)('array', {
      type: Array
    }, true).def(VueTypes.sensibleDefaults.array);
  },

  get object() {
    return (0, _utils.toType)('object', {
      type: Object
    }, true).def(VueTypes.sensibleDefaults.object);
  },

  get integer() {
    return (0, _utils.toType)('integer', {
      type: Number,
      validator: function validator(value) {
        return (0, _utils.isInteger)(value);
      }
    }).def(VueTypes.sensibleDefaults.integer);
  },

  get symbol() {
    return (0, _utils.toType)('symbol', {
      type: null,
      validator: function validator(value) {
        return typeof value === 'symbol';
      }
    }, true);
  },

  extend: function extend(props) {
    if (props === void 0) {
      props = {};
    }

    var _props = props,
        name = _props.name,
        _props$validate = _props.validate,
        validate = _props$validate === void 0 ? false : _props$validate,
        _props$getter = _props.getter,
        getter = _props$getter === void 0 ? false : _props$getter,
        type = _objectWithoutPropertiesLoose(_props, ["name", "validate", "getter"]);

    var descriptor;

    if (getter) {
      descriptor = {
        get: function get() {
          return (0, _utils.toType)(name, Object.assign({}, type), validate);
        },
        enumerable: true,
        configurable: false
      };
    } else {
      var validator = type.validator;
      descriptor = {
        value: function value() {
          var ret = (0, _utils.toType)(name, Object.assign({}, type), validate);

          if (validator) {
            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            ret.validator = validator.bind.apply(validator, [ret].concat(args));
          }

          return ret;
        },
        writable: false,
        enumerable: true,
        configurable: false
      };
    }

    return Object.defineProperty(this, name, descriptor);
  },
  custom: function custom(validatorFn, warnMsg) {
    if (warnMsg === void 0) {
      warnMsg = 'custom validation failed';
    }

    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument');
    }

    return (0, _utils.toType)(validatorFn.name || '<<anonymous function>>', {
      validator: function validator(value) {
        var valid = validatorFn(value);
        if (!valid) (0, _utils.warn)(this._vueTypes_name + " - " + warnMsg);
        return valid;
      }
    });
  },
  oneOf: function oneOf(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }

    var msg = "oneOf - value should be one of \"" + arr.join('", "') + "\"";
    var allowedTypes = arr.reduce(function (ret, v) {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor);
      }

      return ret;
    }, []);
    return (0, _utils.toType)('oneOf', {
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator: function validator(value) {
        var valid = arr.indexOf(value) !== -1;
        if (!valid) (0, _utils.warn)(msg);
        return valid;
      }
    });
  },
  instanceOf: function instanceOf(instanceConstructor) {
    return (0, _utils.toType)('instanceOf', {
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!(0, _utils.isArray)(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }

    var hasCustomValidators = false;
    var nativeChecks = arr.reduce(function (ret, type) {
      if ((0, _isPlainObject.default)(type)) {
        if (type._vueTypes_name === 'oneOf') {
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
      return (0, _utils.toType)('oneOfType', {
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
        if (type._vueTypes_name === 'oneOf') {
          return type.type ? (0, _utils.validateType)(type.type, value, true) : true;
        }

        return (0, _utils.validateType)(type, value, true);
      });
      if (!valid) (0, _utils.warn)("oneOfType - value type should be one of \"" + typesStr + "\"");
      return valid;
    });
  },
  arrayOf: function arrayOf(type) {
    return (0, _utils.toType)('arrayOf', {
      type: Array,
      validator: function validator(values) {
        var valid = values.every(function (value) {
          return (0, _utils.validateType)(type, value);
        });
        if (!valid) (0, _utils.warn)("arrayOf - value must be an array of \"" + (0, _utils.getType)(type) + "\"");
        return valid;
      }
    });
  },
  objectOf: function objectOf(type) {
    return (0, _utils.toType)('objectOf', {
      type: Object,
      validator: function validator(obj) {
        var valid = Object.keys(obj).every(function (key) {
          return (0, _utils.validateType)(type, obj[key]);
        });
        if (!valid) (0, _utils.warn)("objectOf - value must be an object of \"" + (0, _utils.getType)(type) + "\"");
        return valid;
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    var requiredKeys = keys.filter(function (key) {
      return obj[key] && obj[key].required === true;
    });
    var type = (0, _utils.toType)('shape', {
      type: Object,
      validator: function validator(value) {
        var _this = this;

        if (!(0, _isPlainObject.default)(value)) {
          return false;
        }

        var valueKeys = Object.keys(value); // check for required keys (if any)

        if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
          return valueKeys.indexOf(req) === -1;
        })) {
          (0, _utils.warn)("shape - at least one of required properties \"" + requiredKeys.join('", "') + "\" is not present");
          return false;
        }

        return valueKeys.every(function (key) {
          if (keys.indexOf(key) === -1) {
            if (_this._vueTypes_isLoose === true) return true;
            (0, _utils.warn)("shape - object is missing \"" + key + "\" property");
            return false;
          }

          var type = obj[key];
          return (0, _utils.validateType)(type, value[key]);
        });
      }
    });
    Object.defineProperty(type, '_vueTypes_isLoose', {
      enumerable: false,
      writable: true,
      value: false
    });
    Object.defineProperty(type, 'loose', {
      get: function get() {
        this._vueTypes_isLoose = true;
        return this;
      },
      enumerable: false
    });
    return type;
  }
};
(0, _sensibles.setDefaults)(VueTypes);
VueTypes.utils = {
  validate: function validate(value, type) {
    return (0, _utils.validateType)(type, value, true);
  },
  toType: _utils.toType
};
var _default = VueTypes;
exports.default = _default;