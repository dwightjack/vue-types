import Vue from 'vue';

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

/*!
 * isobject <https://github.com/jonschlinkert/isobject>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObject(val) {
  return val != null && typeof val === 'object' && Array.isArray(val) === false;
}

/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */

function isObjectObject(o) {
  return isObject(o) === true
    && Object.prototype.toString.call(o) === '[object Object]';
}

function isPlainObject(o) {
  var ctor,prot;

  if (isObjectObject(o) === false) return false;

  // If has modified constructor
  ctor = o.constructor;
  if (typeof ctor !== 'function') return false;

  // If has modified prototype
  prot = ctor.prototype;
  if (isObjectObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (prot.hasOwnProperty('isPrototypeOf') === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

var ObjProto = Object.prototype;
var toString = ObjProto.toString;
var hasOwn = ObjProto.hasOwnProperty;
var FN_MATCH_REGEXP = /^\s*function (\w+)/;
function getType(fn) {
  var type = fn !== null && fn !== undefined ? fn.type ? fn.type : fn : null;
  var match = type && type.toString().match(FN_MATCH_REGEXP);
  return match && match[1];
}
function getNativeType(value) {
  if (value === null || value === undefined) return null;
  var match = value.constructor.toString().match(FN_MATCH_REGEXP);
  return match && match[1];
}
function noop() {}
var stubTrue = function stubTrue() {
  return true;
};
var has = function has(obj, prop) {
  return hasOwn.call(obj, prop);
};
var isInteger = Number.isInteger || function isInteger(value) {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};
var isArray = Array.isArray || function isArray(value) {
  return toString.call(value) === '[object Array]';
};
var isFunction = function isFunction(value) {
  return toString.call(value) === '[object Function]';
};
function withDefault(type) {
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
      } else if (isPlainObject(def)) {
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
}
function withRequired(type) {
  return Object.defineProperty(type, 'isRequired', {
    get: function get() {
      this.required = true;
      return this;
    },
    enumerable: false
  });
}
function withValidate(type) {
  return Object.defineProperty(type, 'validate', {
    value: function value(fn) {
      this.validator = fn.bind(this);
      return this;
    },
    enumerable: false
  });
}
function toType(name, obj, validateFn) {
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
  } else {
    Object.defineProperty(obj, 'validate', {
      value: function value() {
        warn(name + " - \"validate\" method not supported on this type");
        return this;
      },
      enumerable: false
    });
  }

  if (isFunction(obj.validator)) {
    obj.validator = obj.validator.bind(obj);
  }

  return obj;
}
function validateType(type, value, silent) {
  if (silent === void 0) {
    silent = false;
  }

  var typeToCheck = type;
  var valid = true;
  var expectedType;

  if (!isPlainObject(type)) {
    typeToCheck = {
      type: type
    };
  }

  var namePrefix = typeToCheck._vueTypes_name ? typeToCheck._vueTypes_name + ' - ' : '';

  if (hasOwn.call(typeToCheck, 'type') && typeToCheck.type !== null) {
    if (typeToCheck.type === undefined) {
      throw new TypeError("[VueTypes error]: Setting type to undefined is not allowed.");
    }

    if (!typeToCheck.required && value === undefined) {
      return valid;
    }

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
        valid = isPlainObject(value);
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
}
var warn = noop;

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  warn = hasConsole ? function warn(msg) {
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

    if (isArray(props)) {
      props.forEach(function (p) {
        return VueTypes.extend(p);
      });
      return this;
    }

    var _props = props,
        name = _props.name,
        _props$validate = _props.validate,
        validate = _props$validate === void 0 ? false : _props$validate,
        _props$getter = _props.getter,
        getter = _props$getter === void 0 ? false : _props$getter,
        opts = _objectWithoutPropertiesLoose(_props, ["name", "validate", "getter"]);

    if (has(VueTypes, name)) {
      throw new TypeError("[VueTypes error]: Type \"" + name + "\" already defined");
    }

    var type = opts.type,
        _opts$validator = opts.validator,
        validator = _opts$validator === void 0 ? stubTrue : _opts$validator;

    if (type && type._vueTypes_name) {
      delete opts.type;
      var keys = ['type', 'required', 'default'];

      for (var i = 0; i < keys.length; i += 1) {
        var key = keys[i];

        if (type[key] !== undefined) {
          opts[key] = type[key];
        }
      }

      validate = false;

      if (isFunction(type.validator)) {
        opts.validator = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          return type.validator.apply(type, args) && validator.apply(this, args);
        };
      }
    }

    var descriptor;

    if (getter) {
      descriptor = {
        get: function get() {
          return toType(name, Object.assign({}, opts), validate);
        },
        enumerable: true,
        configurable: false
      };
    } else {
      var _validator = opts.validator;
      descriptor = {
        value: function value() {
          var ret = toType(name, Object.assign({}, opts), validate);

          if (_validator) {
            for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              args[_key2] = arguments[_key2];
            }

            ret.validator = _validator.bind.apply(_validator, [ret].concat(args));
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
    var nativeChecks = arr.reduce(function (ret, type) {
      if (isPlainObject(type)) {
        if (type._vueTypes_name === 'oneOf') {
          return ret.concat(type.type || []);
        }

        if (isFunction(type.validator)) {
          hasCustomValidators = true;
          return ret;
        }

        if (type.type) {
          if (isArray(type.type)) return ret.concat(type.type);
          ret.push(type.type);
        }

        return ret;
      }

      ret.push(type);
      return ret;
    }, []);

    if (!hasCustomValidators) {
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

        if (!isPlainObject(value)) {
          return false;
        }

        var valueKeys = Object.keys(value);

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

export default VueTypes;
//# sourceMappingURL=vue-types.m.js.map
