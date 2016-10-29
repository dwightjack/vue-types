var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

import isPlainObject from 'lodash.isplainobject';
import objectAssign from 'object-assign';

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
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
export var isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
export var isArray = Array.isArray || function (value) {
  return toString.call(value) === '[object Array]';
};

/**
 * Checks if a value is a function
 *
 * @param {any} val - Value to check
 * @returns {boolean}
 */
export var isFunction = function isFunction(value) {
  return toString.call(value) === '[object Function]';
};

/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 * @param {object} type - Object to enhance
 */
export var withDefault = function withDefault(type) {
  Object.defineProperty(type, 'def', {
    value: function value(def) {
      if (!validateType(this, def)) {
        console.warn('default value not allowed here', def); // eslint-disable-line no-console
        return type;
      }
      var newType = objectAssign({}, this, {
        default: isArray(def) || isPlainObject(def) ? function () {
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
 *
 * @param {object} type - Object to enhance
 */
export var withRequired = function withRequired(type) {
  Object.defineProperty(type, 'isRequired', {
    get: function get() {
      var newType = objectAssign({ required: true }, this);
      withDefault(newType);
      return newType;
    },

    enumerable: false
  });
};

/**
 * Adds `isRequired` and `def` modifiers to an object
 *
 * @param {object} obj - Object to enhance
 * @returns {object}
 */
export var toType = function toType(obj) {
  withRequired(obj);
  withDefault(obj);
  return obj;
};

/**
 * Validates a given value agains a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
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
      valid = isArray(value);
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