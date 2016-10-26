/**
 * vue-props v1.0.0
 * Copyright (c) 2016 Marco Solazzi
 * MIT License
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueProps"] = factory();
	else
		root["VueProps"] = factory();
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
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

"use strict";
'use strict';

exports.__esModule = true;
var noop = function noop() {};

var ObjProto = Object.prototype;

var toString = ObjProto.toString;

var isFunction = function isFunction(val) {
  return toString.call(val) === '[object Function]';
};

function withDefault(type, def) {
  return Object.assign({}, this[type], { default: def });
}

var withRequired = function withRequired(type) {
  Object.defineProperty(type, 'isRequired', {
    get: function get() {
      return Object.assign({ required: true }, this);
    },

    enumerable: true,
    writable: false
  });
};

var validateType = function validateType(type, value) {
  if (type.validator) {
    return type.validator(value);
  }
  if (type.type === Function) {
    return isFunction(value);
  }
  if (type.type === Array) {
    return Array.isArray(value);
  }
  return value === type.type(value);
};

var vueTypes = {

  func: {
    type: Function,
    default: noop
  },

  array: {
    type: Array,
    default: Array
  },

  object: {
    type: Object,
    default: Object
  },

  bool: {
    type: Boolean,
    default: true
  },

  string: {
    type: String,
    default: ''
  },

  num: {
    type: Number,
    default: 0
  },

  number: {
    type: Number,
    default: 0
  },

  any: {
    type: null
  },

  integer: {
    validator: function validator(value) {
      return Number.isInteger(value);
    },

    default: 0
  },

  custom: function custom(validator) {
    if (typeof validator !== 'function') {
      throw new TypeError('You must provide a function as argument');
    }

    var type = {
      validator: validator
    };

    type.def = function (def) {
      return Object.assign({ default: def }, type);
    };

    withRequired(type);

    return type;
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
    return this.custom(function (value) {
      return value instanceof instanceConstructor;
    });
  },
  oneOfType: function oneOfType(arr) {
    if (!Array.isArray(arr)) {
      throw new TypeError('You must provide an array as argument');
    }

    return this.custom(function (value) {
      return arr.some(function (type) {
        return validateType(type, value);
      });
    });
  },
  arrayOf: function arrayOf(type) {
    return this.custom(function (values) {
      if (!Array.isArray(values)) {
        return false;
      }
      return values.every(function (value) {
        return validateType(type, value);
      });
    });
  },
  shape: function shape(obj) {
    var keys = Object.keys(obj);
    return this.custom(function (value) {
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

Object.keys(vueTypes).forEach(function (key) {
  if (isFunction(vueTypes[key]) === false) {
    Object.defineProperty(vueTypes[key], 'def', {
      value: withDefault.bind(vueTypes, key),
      enumerable: true,
      writable: false
    });

    withRequired(vueTypes[key]);
  }
});

exports.default = vueTypes;
module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ }
/******/ ])
});
;