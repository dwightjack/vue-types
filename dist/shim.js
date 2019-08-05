"use strict";

exports.__esModule = true;
exports.default = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _sensibles = require("./sensibles");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isArray = Array.isArray || function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};

var type = function type(props) {
  return Object.assign({
    def: function def(v) {
      if (v === undefined && !this.default) {
        return this;
      }

      if (isArray(v)) {
        this.default = function () {
          return [].concat(v);
        };
      } else if ((0, _isPlainObject.default)(v)) {
        this.default = function () {
          return Object.assign({}, v);
        };
      } else {
        this.default = v;
      }

      return this;
    },

    get isRequired() {
      this.required = true;
      return this;
    },

    validator: function validator() {
      return true;
    }
  }, props);
};

var vueTypes = (0, _sensibles.setDefaults)({
  utils: {
    toType: type,
    validate: function validate() {
      return true;
    }
  }
});
var typeMap = {
  func: Function,
  bool: Boolean,
  string: String,
  number: Number,
  integer: Number,
  array: Array,
  object: Object,
  arrayOf: Array,
  objectOf: Object,
  shape: Object
};
var getters = ['any', 'func', 'bool', 'string', 'number', 'array', 'object', 'symbol'];
var methods = ['oneOf', 'custom', 'instanceOf', 'oneOfType', 'arrayOf', 'objectOf'];

function createValidator(root, name, getter, props) {
  var _descr;

  if (getter === void 0) {
    getter = false;
  }

  var prop = getter ? 'get' : 'value';
  var descr = (_descr = {}, _descr[prop] = function () {
    return type(props).def(getter ? vueTypes.sensibleDefaults[name] : undefined);
  }, _descr);
  return Object.defineProperty(root, name, descr);
}

getters.forEach(function (p) {
  return createValidator(vueTypes, p, true, {
    type: typeMap[p] || null,
    validate: function validate() {}
  });
});
methods.forEach(function (p) {
  return createValidator(vueTypes, p, false, {
    type: typeMap[p] || null
  });
});
createValidator(vueTypes, 'integer', true, {
  type: Number
}); // does not have a validate method

Object.defineProperty(vueTypes, 'shape', {
  value: function value() {
    return Object.defineProperty(type({
      type: Object
    }), 'loose', {
      get: function get() {
        return this;
      },
      enumerable: false
    });
  }
});

vueTypes.extend = function extend(props) {
  var name = props.name,
      validate = props.validate,
      _props$getter = props.getter,
      getter = _props$getter === void 0 ? false : _props$getter,
      _props$type = props.type,
      type = _props$type === void 0 ? null : _props$type;
  return createValidator(vueTypes, name, getter, {
    type: type,
    validate: validate ? function () {} : undefined
  });
};
/* eslint-disable no-console */


if (process.env.NODE_ENV !== 'production') {
  _vue.default.config.silent === false && console.warn('You are using the production shimmed version of VueTypes in a development build. Refer to https://github.com/dwightjack/vue-types#production-build to learn how to configure VueTypes for usage in multiple environments.');
}
/* eslint-enable no-console */


var _default = vueTypes;
exports.default = _default;