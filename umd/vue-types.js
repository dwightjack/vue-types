
/*! vue-types - v1.5.0
 * https://github.com/dwightjack/vue-types
 * Copyright (c) 2019 - Marco Solazzi;
 * Licensed MIT
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue')) :
  typeof define === 'function' && define.amd ? define(['vue'], factory) :
  (global = global || self, global.VueTypes = factory(global.Vue));
}(this, function (Vue) { 'use strict';

  Vue = Vue && Vue.hasOwnProperty('default') ? Vue['default'] : Vue;

  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;

    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }

    return target;
  }

  var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

  var _freeGlobal = freeGlobal;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = _freeGlobal || freeSelf || Function('return this')();

  var _root = root;

  /** Built-in value references. */
  var Symbol$1 = _root.Symbol;

  var _Symbol = Symbol$1;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  var _getRawTag = getRawTag;

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  var _objectToString = objectToString;

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? _getRawTag(value)
      : _objectToString(value);
  }

  var _baseGetTag = baseGetTag;

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

  var _overArg = overArg;

  /** Built-in value references. */
  var getPrototype = _overArg(Object.getPrototypeOf, Object);

  var _getPrototype = getPrototype;

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
    return value != null && typeof value == 'object';
  }

  var isObjectLike_1 = isObjectLike;

  /** `Object#toString` result references. */
  var objectTag = '[object Object]';

  /** Used for built-in method references. */
  var funcProto = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to infer the `Object` constructor. */
  var objectCtorString = funcToString.call(Object);

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
    if (!isObjectLike_1(value) || _baseGetTag(value) != objectTag) {
      return false;
    }
    var proto = _getPrototype(value);
    if (proto === null) {
      return true;
    }
    var Ctor = hasOwnProperty$1.call(proto, 'constructor') && proto.constructor;
    return typeof Ctor == 'function' && Ctor instanceof Ctor &&
      funcToString.call(Ctor) == objectCtorString;
  }

  var isPlainObject_1 = isPlainObject;

  var ObjProto = Object.prototype;
  var toString = ObjProto.toString;
  var hasOwn = ObjProto.hasOwnProperty;
  var FN_MATCH_REGEXP = /^\s*function (\w+)/; // https://github.com/vuejs/vue/blob/dev/src/core/util/props.js#L177

  var getType = function getType(fn) {
    var type = fn !== null && fn !== undefined ? fn.type ? fn.type : fn : null;
    var match = type && type.toString().match(FN_MATCH_REGEXP);
    return match && match[1];
  };
  var getNativeType = function getNativeType(value) {
    if (value === null || value === undefined) return null;
    var match = value.constructor.toString().match(FN_MATCH_REGEXP);
    return match && match[1];
  };
  /**
   * No-op function
   */

  var noop = function noop() {};
  /**
   * Determines whether the passed value is an integer. Uses `Number.isInteger` if available
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger
   * @param {*} value - The value to be tested for being an integer.
   * @returns {boolean}
   */

  var isInteger = Number.isInteger || function (value) {
    return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
  };
  /**
   * Determines whether the passed value is an Array.
   *
   * @param {*} value - The value to be tested for being an array.
   * @returns {boolean}
   */

  var isArray = Array.isArray || function (value) {
    return toString.call(value) === '[object Array]';
  };
  /**
   * Checks if a value is a function
   *
   * @param {any} value - Value to check
   * @returns {boolean}
   */

  var isFunction = function isFunction(value) {
    return toString.call(value) === '[object Function]';
  };
  /**
   * Adds a `def` method to the object returning a new object with passed in argument as `default` property
   *
   * @param {object} type - Object to enhance
   * @returns {object} the passed-in prop type
   */

  var withDefault = function withDefault(type) {
    return Object.defineProperty(type, 'def', {
      value: function value(def) {
        if (def === undefined && !this.default) {
          return this;
        }

        if (!isFunction(def) && !validateType(this, def)) {
          warn(this._vueTypes_name + " - invalid default value: \"" + def + "\"", def);
          return this;
        }

        if (isArray(def)) {
          this.default = function () {
            return [].concat(def);
          };
        } else if (isPlainObject_1(def)) {
          this.default = function () {
            return Object.assign({}, def);
          };
        } else {
          this.default = def;
        }

        return this;
      },
      enumerable: false,
      writable: false
    });
  };
  /**
   * Adds a `isRequired` getter returning a new object with `required: true` key-value
   *
   * @param {object} type - Object to enhance
   * @returns {object} the passed-in prop type
   */

  var withRequired = function withRequired(type) {
    return Object.defineProperty(type, 'isRequired', {
      get: function get() {
        this.required = true;
        return this;
      },
      enumerable: false
    });
  };
  /**
   * Adds a validate method useful to set the prop `validator` function.
   *
   * @param {object} type Prop type to extend
   * @returns {object} the passed-in prop type
   */

  var withValidate = function withValidate(type) {
    return Object.defineProperty(type, 'validate', {
      value: function value(fn) {
        this.validator = fn.bind(this);
        return this;
      },
      enumerable: false
    });
  };
  /**
   * Adds `isRequired` and `def` modifiers to an object
   *
   * @param {string} name - Type internal name
   * @param {object} obj - Object to enhance
   * @returns {object}
   */

  var toType = function toType(name, obj, validateFn) {
    if (validateFn === void 0) {
      validateFn = false;
    }

    Object.defineProperty(obj, '_vueTypes_name', {
      enumerable: false,
      writable: false,
      value: name
    });
    withDefault(withRequired(obj));

    if (validateFn) {
      withValidate(obj);
    }

    if (isFunction(obj.validator)) {
      obj.validator = obj.validator.bind(obj);
    }

    return obj;
  };
  /**
   * Validates a given value against a prop type object
   *
   * @param {Object|*} type - Type to use for validation. Either a type object or a constructor
   * @param {*} value - Value to check
   * @param {boolean} silent - Silence warnings
   * @returns {boolean}
   */

  var validateType = function validateType(type, value, silent) {
    if (silent === void 0) {
      silent = false;
    }

    var typeToCheck = type;
    var valid = true;
    var expectedType;

    if (!isPlainObject_1(type)) {
      typeToCheck = {
        type: type
      };
    }

    var namePrefix = typeToCheck._vueTypes_name ? typeToCheck._vueTypes_name + ' - ' : '';

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
          valid = isPlainObject_1(value);
        } else if (expectedType === 'String' || expectedType === 'Number' || expectedType === 'Boolean' || expectedType === 'Function') {
          valid = getNativeType(value) === expectedType;
        } else {
          valid = value instanceof typeToCheck.type;
        }
      }
    }

    if (!valid) {
      silent === false && warn(namePrefix + "value \"" + value + "\" should be of type \"" + expectedType + "\"");
      return false;
    }

    if (hasOwn.call(typeToCheck, 'validator') && isFunction(typeToCheck.validator)) {
      // swallow warn
      var oldWarn;

      if (silent) {
        oldWarn = warn;
        warn = noop;
      }

      valid = typeToCheck.validator(value);
      oldWarn && (warn = oldWarn);
      if (!valid && silent === false) warn(namePrefix + "custom validation failed");
      return valid;
    }

    return valid;
  };
  var warn = noop;

  {
    var hasConsole = typeof console !== 'undefined';
    warn = hasConsole ? function (msg) {
      Vue.config.silent === false && console.warn("[VueTypes warn]: " + msg);
    } : noop;
  }

  var typeDefaults = function typeDefaults() {
    return {
      func: function func() {},
      bool: true,
      string: '',
      number: 0,
      array: function array() {
        return [];
      },
      object: function object() {
        return {};
      },
      integer: 0
    };
  };

  var setDefaults = function setDefaults(root) {
    var currentDefaults = typeDefaults();
    return Object.defineProperty(root, 'sensibleDefaults', {
      enumerable: false,
      set: function set(value) {
        if (value === false) {
          currentDefaults = {};
        } else if (value === true) {
          currentDefaults = typeDefaults();
        } else {
          currentDefaults = value;
        }
      },
      get: function get() {
        return currentDefaults;
      }
    });
  };

  var VueTypes = {
    get any() {
      return toType('any', {
        type: null
      }, true);
    },

    get func() {
      return toType('function', {
        type: Function
      }, true).def(VueTypes.sensibleDefaults.func);
    },

    get bool() {
      return toType('boolean', {
        type: Boolean
      }, true).def(VueTypes.sensibleDefaults.bool);
    },

    get string() {
      return toType('string', {
        type: String
      }, true).def(VueTypes.sensibleDefaults.string);
    },

    get number() {
      return toType('number', {
        type: Number
      }, true).def(VueTypes.sensibleDefaults.number);
    },

    get array() {
      return toType('array', {
        type: Array
      }, true).def(VueTypes.sensibleDefaults.array);
    },

    get object() {
      return toType('object', {
        type: Object
      }, true).def(VueTypes.sensibleDefaults.object);
    },

    get integer() {
      return toType('integer', {
        type: Number,
        validator: function validator(value) {
          return isInteger(value);
        }
      }).def(VueTypes.sensibleDefaults.integer);
    },

    get symbol() {
      return toType('symbol', {
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
            return toType(name, type, validate);
          },
          enumerable: true,
          configurable: false
        };
      } else {
        var validator = type.validator;
        descriptor = {
          value: function value() {
            if (validator) {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              type.validator = validator.bind.apply(validator, [this].concat(args));
            }

            return toType(name, type, validate);
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

      return toType(validatorFn.name || '<<anonymous function>>', {
        validator: function validator(value) {
          var valid = validatorFn(value);
          if (!valid) warn(this._vueTypes_name + " - " + warnMsg);
          return valid;
        }
      });
    },
    oneOf: function oneOf(arr) {
      if (!isArray(arr)) {
        throw new TypeError('[VueTypes error]: You must provide an array as argument');
      }

      var msg = "oneOf - value should be one of \"" + arr.join('", "') + "\"";
      var allowedTypes = arr.reduce(function (ret, v) {
        if (v !== null && v !== undefined) {
          ret.indexOf(v.constructor) === -1 && ret.push(v.constructor);
        }

        return ret;
      }, []);
      return toType('oneOf', {
        type: allowedTypes.length > 0 ? allowedTypes : null,
        validator: function validator(value) {
          var valid = arr.indexOf(value) !== -1;
          if (!valid) warn(msg);
          return valid;
        }
      });
    },
    instanceOf: function instanceOf(instanceConstructor) {
      return toType('instanceOf', {
        type: instanceConstructor
      });
    },
    oneOfType: function oneOfType(arr) {
      if (!isArray(arr)) {
        throw new TypeError('[VueTypes error]: You must provide an array as argument');
      }

      var hasCustomValidators = false;
      var nativeChecks = arr.reduce(function (ret, type, i) {
        if (isPlainObject_1(type)) {
          if (type._vueTypes_name === 'oneOf') {
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
        return toType('oneOfType', {
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
          if (type._vueTypes_name === 'oneOf') {
            return type.type ? validateType(type.type, value, true) : true;
          }

          return validateType(type, value, true);
        });
        if (!valid) warn("oneOfType - value type should be one of \"" + typesStr + "\"");
        return valid;
      });
    },
    arrayOf: function arrayOf(type) {
      return toType('arrayOf', {
        type: Array,
        validator: function validator(values) {
          var valid = values.every(function (value) {
            return validateType(type, value);
          });
          if (!valid) warn("arrayOf - value must be an array of \"" + getType(type) + "\"");
          return valid;
        }
      });
    },
    objectOf: function objectOf(type) {
      return toType('objectOf', {
        type: Object,
        validator: function validator(obj) {
          var valid = Object.keys(obj).every(function (key) {
            return validateType(type, obj[key]);
          });
          if (!valid) warn("objectOf - value must be an object of \"" + getType(type) + "\"");
          return valid;
        }
      });
    },
    shape: function shape(obj) {
      var keys = Object.keys(obj);
      var requiredKeys = keys.filter(function (key) {
        return obj[key] && obj[key].required === true;
      });
      var type = toType('shape', {
        type: Object,
        validator: function validator(value) {
          var _this = this;

          if (!isPlainObject_1(value)) {
            return false;
          }

          var valueKeys = Object.keys(value); // check for required keys (if any)

          if (requiredKeys.length > 0 && requiredKeys.some(function (req) {
            return valueKeys.indexOf(req) === -1;
          })) {
            warn("shape - at least one of required properties \"" + requiredKeys.join('", "') + "\" is not present");
            return false;
          }

          return valueKeys.every(function (key) {
            if (keys.indexOf(key) === -1) {
              if (_this._vueTypes_isLoose === true) return true;
              warn("shape - object is missing \"" + key + "\" property");
              return false;
            }

            var type = obj[key];
            return validateType(type, value[key]);
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
  setDefaults(VueTypes);
  VueTypes.utils = {
    validate: function validate(value, type) {
      return validateType(type, value, true);
    },
    toType: toType
  };

  return VueTypes;

}));
//# sourceMappingURL=vue-types.js.map
