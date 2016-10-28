import _typeof from 'babel-runtime/helpers/typeof';
import isPlainObject from 'lodash.isplainobject';

var ObjProto = Object.prototype;
var toString = ObjProto.toString;
export var hasOwn = ObjProto.hasOwnProperty;

var FN_MATCH_REGEXP = /^\s*function (\w+)/;

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L159
var getType = function getType(fn) {
  var match = fn && fn.toString().match(FN_MATCH_REGEXP);
  return match && match[1];
};

/**
 * No-op function
 */
export var noop = function noop() {};

/**
 * Checks for a own property in an object
 *
 * @param {object} obj - Object
 * @param {string} prop - Property to check
 */
export var has = function has(obj, prop) {
  return hasOwn.call(obj, prop);
};

/**
 * Checks if a value is a function
 *
 * @param {any} val - Value to check
 * @return {boolean}
 */
export var isFunction = function isFunction(val) {
  return toString.call(val) === '[object Function]';
};

/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 * @param {object} type - Object to enhance
 */
export var withDefault = function withDefault(type) {
  Object.defineProperty(type, 'def', {
    value: function value(def) {
      if (!validateType(this, def)) {
        console.warn('default value not allowed here', def); // eslint-disable-line no-console
        return type;
      }
      var newType = Object.assign({}, this, {
        default: Array.isArray(def) || isPlainObject(def) ? function () {
          return def;
        } : def
      });
      if (!hasOwn.call(newType, 'required')) {
        withRequired(newType);
      }
      return newType;
    },

    enumerable: false,
    writable: false
  });
};

/**
 * Adds a `isRequired` getter returning a new object with `required: true` key-value
 * @param {object} type - Object to enhance
 */
export var withRequired = function withRequired(type) {
  Object.defineProperty(type, 'isRequired', {
    get: function get() {
      var newType = Object.assign({ required: true }, this);
      withDefault(newType);
      return newType;
    },

    enumerable: false
  });
};

/**
 * Adds `isRequired` and `def` modifiers to an object
 * @param obj
 * @returns {*}
 */
export var toType = function toType(obj) {
  withRequired(obj);
  withDefault(obj);
  return obj;
};

/**
 * Validated
 * @param type
 * @param value
 * @returns {boolean}
 */
export var validateType = function validateType(type, value) {
  var typeToCheck = type;
  var valid = true;

  if (!isPlainObject(type)) {
    typeToCheck = { type: type };
  }

  if (hasOwn.call(typeToCheck, 'type') && typeToCheck.type !== null) {
    var expectedType = getType(typeToCheck.type);

    if (expectedType === 'Array') {
      valid = Array.isArray(value);
    } else if (expectedType === 'Object') {
      valid = isPlainObject(value);
    } else if (expectedType === 'String' || expectedType === 'Number' || expectedType === 'Boolean' || expectedType === 'Function') {
      valid = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === expectedType.toLowerCase();
    } else {
      valid = value instanceof typeToCheck.type;
    }
  }

  if (!valid) {
    return false;
  }

  if (hasOwn.call(typeToCheck, 'validator') && isFunction(typeToCheck.validator)) {
    return typeToCheck.validator(value);
  }
  return valid;
};