/**
 * vue-types v0.5.2
 * Copyright (c) 2016 Marco Solazzi
 * MIT License
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueTypes"] = factory();
	else
		root["VueTypes"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** `Object#toString` result references. */
var objectTag = '[object Object]';

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/** Used for built-in method references. */
var funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/** Used to infer the `Object` constructor. */
var objectCtorString = funcToString.call(Object);

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var getPrototype = overArg(Object.getPrototypeOf, Object);

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is a plain object, that is, an object created by the
 * `Object` constructor or one with a `[[Prototype]]` of `null`.
 *
 * @static
 * @memberOf _
 * @since 0.8.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a plain object, else `false`.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 * }
 *
 * _.isPlainObject(new Foo);
 * // => false
 *
 * _.isPlainObject([1, 2, 3]);
 * // => false
 *
 * _.isPlainObject({ 'x': 0, 'y': 0 });
 * // => true
 *
 * _.isPlainObject(Object.create(null));
 * // => true
 */
function isPlainObject(value) {
  if (!isObjectLike(value) ||
      objectToString.call(value) != objectTag || isHostObject(value)) {
    return false;
  }
  var proto = getPrototype(value);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor;
  return (typeof Ctor == 'function' &&
    Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString);
}

module.exports = isPlainObject;


/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

exports.__esModule = true;

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _objectAssign = __webpack_require__(1);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _utils = __webpack_require__(3);

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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

exports.__esModule = true;
exports.warn = exports.validateType = exports.toType = exports.withRequired = exports.withDefault = exports.isFunction = exports.isArray = exports.isInteger = exports.has = exports.noop = exports.getNativeType = exports.getType = exports.hasOwn = undefined;

var _lodash = __webpack_require__(0);

var _lodash2 = _interopRequireDefault(_lodash);

var _objectAssign = __webpack_require__(1);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObjProto = Object.prototype;
var toString = ObjProto.toString;
var hasOwn = exports.hasOwn = ObjProto.hasOwnProperty;

var FN_MATCH_REGEXP = /^\s*function (\w+)/;

// https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L159
var getType = exports.getType = function getType(fn) {
  var type = fn !== null && fn !== undefined ? fn.type ? fn.type : fn : null;
  var match = type && type.toString().match(FN_MATCH_REGEXP);
  return match && match[1];
};

var getNativeType = exports.getNativeType = function getNativeType(value) {
  if (value === null || value === undefined) return null;
  var match = value.constructor.toString().match(FN_MATCH_REGEXP);
  return match && match[1];
};

/**
 * No-op function
 */
var noop = exports.noop = function noop() {};

/**
 * Checks for a own property in an object
 *
 * @param {object} obj - Object
 * @param {string} prop - Property to check
 */
var has = exports.has = function has(obj, prop) {
  return hasOwn.call(obj, prop);
};

/**
 * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
 * @param {*} value - The value to be tested for being an integer.
 * @returns {boolean}
 */
var isInteger = exports.isInteger = Number.isInteger || function (value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/**
 * Determines whether the passed value is an Array.
 *
 * @param {*} value - The value to be tested for being an array.
 * @returns {boolean}
 */
var isArray = exports.isArray = Array.isArray || function (value) {
  return toString.call(value) === '[object Array]';
};

/**
 * Checks if a value is a function
 *
 * @param {any} value - Value to check
 * @returns {boolean}
 */
var isFunction = exports.isFunction = function isFunction(value) {
  return toString.call(value) === '[object Function]';
};

/**
 * Adds a `def` method to the object returning a new object with passed in argument as `default` property
 *
 * @param {object} type - Object to enhance
 */
var withDefault = exports.withDefault = function withDefault(type) {
  Object.defineProperty(type, 'def', {
    value: function value(def) {
      if (!validateType(this, def)) {
        warn('invalid default value', def);
        return type;
      }
      var newType = (0, _objectAssign2.default)({}, this, {
        default: isArray(def) || (0, _lodash2.default)(def) ? function () {
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
var withRequired = exports.withRequired = function withRequired(type) {
  Object.defineProperty(type, 'isRequired', {
    get: function get() {
      var newType = (0, _objectAssign2.default)({ required: true }, this);
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
var toType = exports.toType = function toType(obj) {
  withRequired(obj);
  withDefault(obj);
  return obj;
};

/**
 * Validates a given value agains a prop type object
 *
 * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
 * @param {*} value - Value to check
 * @param {boolean} silent - Silence warnings
 * @returns {boolean}
 */
var validateType = exports.validateType = function validateType(type, value) {
  var silent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var typeToCheck = type;
  var valid = true;
  var expectedType = void 0;
  if (!(0, _lodash2.default)(type)) {
    typeToCheck = { type: type };
  }

  if (hasOwn.call(typeToCheck, 'type') && typeToCheck.type !== null) {
    if (isArray(typeToCheck.type)) {
      valid = typeToCheck.type.some(function (type) {
        return validateType(type, value, true);
      });
      expectedType = typeToCheck.type.map(function (type) {
        return getType(type);
      }).join(' or ');
    } else {
      expectedType = getType(typeToCheck);

      if (expectedType === 'Array') {
        valid = isArray(value);
      } else if (expectedType === 'Object') {
        valid = (0, _lodash2.default)(value);
      } else if (expectedType === 'String' || expectedType === 'Number' || expectedType === 'Boolean' || expectedType === 'Function') {
        valid = getNativeType(value) === expectedType;
      } else {
        valid = value instanceof typeToCheck.type;
      }
    }
  }

  if (!valid) {
    silent === false && warn('value "' + value + '" should be of type \'' + expectedType + '\'');
    return false;
  }

  if (hasOwn.call(typeToCheck, 'validator') && isFunction(typeToCheck.validator)) {
    valid = typeToCheck.validator(value);
    if (!valid && silent === false) warn('custom validation failed');
    return valid;
  }
  return valid;
};

var warn = noop;

if (true) {
  (function () {
    var hasConsole = typeof console !== 'undefined';
    exports.warn = warn = function warn(msg) {
      if (hasConsole) {
        console.warn('[VueTypes warn]: ' + msg);
      }
    };
  })();
}

exports.warn = warn;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }
/******/ ])
});
;