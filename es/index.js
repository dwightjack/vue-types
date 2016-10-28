import isPlainObject from 'lodash.isplainobject';
import { noop, toType, isFunction, validateType } from './utils';

var VuePropTypes = {

  get any() {
    return toType({
      type: null
    });
  },

  get func() {
    return toType({
      type: Function,
      default: noop
    });
  },

  get bool() {
    return toType({
      type: Boolean,
      default: true
    });
  },

  get string() {
    return toType({
      type: String,
      default: ''
    });
  },

  get number() {
    return toType({
      type: Number,
      default: 0
    });
  },

  get array() {
    return toType({
      type: Array,
      default: Array
    });
  },

  get object() {
    return toType({
      type: Object,
      default: Object
    });
  },

  get integer() {
    return toType({
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

    return toType({
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
    return toType({
      type: instanceConstructor
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument');
    }

    var nativeChecks = arr.map(function (type) {
      if (isPlainObject(type)) {
        if (type.type && !isFunction(type.validator)) {
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
      return toType({
        type: nativeChecks
      });
    }

    return this.custom(function (value) {
      return arr.some(function (type) {
        return validateType(type, value);
      });
    });
  },
  arrayOf: function arrayOf(type) {
    return toType({
      type: Array,
      validator: function validator(values) {
        return values.every(function (value) {
          return validateType(type, value);
        });
      }
    });
  },
  objectOf: function objectOf(type) {
    return toType({
      type: Object,
      validator: function validator(obj) {
        return Object.keys(obj).every(function (key) {
          return validateType(type, obj[key]);
        });
      }
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    return this.custom(function (value) {
      if (!isPlainObject(value)) {
        return false;
      }
      return Object.keys(value).every(function (key) {
        if (keys.indexOf(key) === -1) {
          return false;
        }
        var type = obj[key];
        return validateType(type, value[key]);
      });
    });
  }
};

export default VuePropTypes;