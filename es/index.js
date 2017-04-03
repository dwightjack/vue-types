import isPlainObject from 'lodash.isplainobject';
import { noop, toType, getType, isFunction, validateType, isInteger, isArray, warn } from './utils';

var VuePropTypes = {

  get any() {
    return toType({
      type: null,
      name: 'any'
    });
  },

  get func() {
    return toType({
      type: Function,
      name: 'function',
      default: noop
    });
  },

  get bool() {
    return toType({
      type: Boolean,
      name: 'boolean',
      default: true
    });
  },

  get string() {
    return toType({
      type: String,
      name: 'string',
      default: ''
    });
  },

  get number() {
    return toType({
      type: Number,
      name: 'number',
      default: 0
    });
  },

  get array() {
    return toType({
      type: Array,
      name: 'array',
      default: Array
    });
  },

  get object() {
    return toType({
      type: Object,
      name: 'object',
      default: Object
    });
  },

  get integer() {
    return toType({
      type: Number,
      name: 'integer',
      validator: function validator(value) {
        return isInteger(value);
      },

      default: 0
    });
  },

  custom: function custom(validatorFn) {
    var warnMsg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'custom validation failed';

    if (typeof validatorFn !== 'function') {
      throw new TypeError('[VueTypes error]: You must provide a function as argument');
    }

    return toType({
      name: validatorFn.name || '<<anonymous function>>',
      validator: function validator() {
        var valid = validatorFn.apply(undefined, arguments);
        if (!valid) warn(warnMsg);
        return valid;
      }
    });
  },
  oneOf: function oneOf(arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }
    var msg = 'value should be one of "' + arr.join('", "') + '"';
    var allowedTypes = arr.reduce(function (ret, v) {
      if (v !== null && v !== undefined) {
        ret.indexOf(v.constructor) === -1 && ret.push(v.constructor);
      }
      return ret;
    }, []);

    return toType({
      name: 'oneOf',
      type: allowedTypes.length > 0 ? allowedTypes : null,
      validator: function validator(value) {
        var valid = arr.indexOf(value) !== -1;
        if (!valid) warn(msg);
        return valid;
      }
    });
  },
  instanceOf: function instanceOf(instanceConstructor) {
    return toType({
      name: 'instanceOf',
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!isArray(arr)) {
      throw new TypeError('[VueTypes error]: You must provide an array as argument');
    }

    var hasCustomValidators = false;

    var nativeChecks = arr.reduce(function (ret, type, i) {
      if (isPlainObject(type)) {
        if (type.name === 'oneOf') {
          return ret.concat(type.type || []);
        }
        if (type.type && !isFunction(type.validator)) {
          if (isArray(type.type)) return ret.concat(type.type);
          ret.push(type.type);
        } else if (isFunction(type.validator)) {
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
      return toType({
        name: 'oneOfType',
        type: nativeChecks
      });
    }

    var typesStr = arr.map(function (type) {
      if (type && isArray(type.type)) {
        return type.type.map(getType);
      }
      return getType(type);
    }).reduce(function (ret, type) {
      return ret.concat(isArray(type) ? type : [type]);
    }, []).join('", "');

    return this.custom(function oneOfType(value) {
      var valid = arr.some(function (type) {
        if (type.name === 'oneOf') {
          return type.type ? validateType(type.type, value, true) : true;
        }
        return validateType(type, value, true);
      });
      if (!valid) warn('value type should be one of "' + typesStr + '"');
      return valid;
    });
  },
  arrayOf: function arrayOf(type) {
    return toType({
      name: 'arrayOf',
      type: Array,
      validator: function validator(values) {
        var valid = values.every(function (value) {
          return validateType(type, value);
        });
        if (!valid) warn('value must be an array of \'' + getType(type) + '\'');
        return valid;
      }
    });
  },
  objectOf: function objectOf(type) {
    return toType({
      name: 'objectOf',
      type: Object,
      validator: function validator(obj) {
        var valid = Object.keys(obj).every(function (key) {
          return validateType(type, obj[key]);
        });
        if (!valid) warn('value must be an object of \'' + getType(type) + '\'');
        return valid;
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    var requiredKeys = keys.filter(function (key) {
      return obj[key] && obj[key].required === true;
    });

    var type = toType({
      name: 'shape',
      type: Object,
      validator: function validator(value) {
        var _this = this;

        if (!isPlainObject(value)) {
          return false;
        }
        var valueKeys = Object.keys(value);

        // check for required keys (if any)
        if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
          return valueKeys.indexOf(req) === -1;
        })) {
          warn('at least one of required properties "' + requiredKeys.join('", "') + '" is not present');
          return false;
        }

        return valueKeys.every(function (key) {
          if (keys.indexOf(key) === -1) {
            if (_this._vueTypes_isLoose === true) return true;
            warn('object is missing "' + key + '" property');
            return false;
          }
          var type = obj[key];
          return validateType(type, value[key]);
        });
      }
    });
    type.validator = type.validator.bind(type);

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

export default VuePropTypes;